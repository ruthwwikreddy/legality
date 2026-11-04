import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, taskId } = params;
  try {
    const { isCompleted } = await req.json();

    const task = await prisma.complianceTask.findUnique({
      where: { id: taskId },
      include: { record: true },
    });

    if (!task || task.recordId !== id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (user.role === 'CLIENT' && task.record.clientId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedTask = await prisma.complianceTask.update({
      where: { id: taskId },
      data: {
        isCompleted: !!isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Check if all tasks in record are completed
    const allTasks = await prisma.complianceTask.findMany({
      where: { recordId: id },
    });
    const allDone = allTasks.length > 0 && allTasks.every((t) => t.isCompleted);

    if (allDone && task.record.status !== 'COMPLIED') {
      await prisma.complianceRecord.update({
        where: { id },
        data: { status: 'COMPLIED' },
      });
    } else if (!allDone && task.record.status === 'COMPLIED') {
      await prisma.complianceRecord.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    await logActivity({
      userId: user.id,
      action: 'COMPLIANCE_TASK_TOGGLED',
      entityType: 'COMPLIANCE',
      entityId: id,
      details: { taskTitle: task.title, isCompleted: !!isCompleted },
    });

    return NextResponse.json({ success: true, task: updatedTask, allDone });
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

