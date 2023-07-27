import prisma from "../lib/prisma";
import { HairSalon } from "@prisma/client";

interface QueueType {
  id: string;
  position: number;
  hairSalonId: string;
  hairSalon: HairSalon;
  customerId: number;
  customer: Customer;
  date: Date;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  city?: string;
}

export async function createQueue(queueInput: QueueType) {
  const newQueue = await prisma.queue.create({
    data: {
      hairSalonId: queueInput.hairSalonId,
      customerId: queueInput.customerId,
      stylistId: queueInput.stylistId,
      position: queueInput.position,
      status: queueInput.status,
    },
  });
  return newQueue;
}

export async function getQueueById(queueId) {
  const queue = await prisma.queue.findUnique({
    where: { id: queueId },
  });
  return queue;
}

export async function getAllQueues() {
  const queues = await prisma.queue.findMany();
  return queues;
}

export async function updateQueue(queueId, queueInput) {
  const updatedQueue = await prisma.queue.update({
    where: { id: queueId },
    data: {
      hairSalonId: queueInput.hairSalonId,
      customerId: queueInput.customerId,
      stylistId: queueInput.stylistId,
      position: queueInput.position,
      status: queueInput.status,
    },
  });
  return updatedQueue;
}

export async function removeCompletedCustomer(customerId) {
  // Trouver la file d'attente pour le client spécifié
  const queueToRemove = await prisma.queue.findFirst({
    where: { customerId: customerId, status: "COMPLETED" },
  });

  if (!queueToRemove) {
    throw new Error("Customer not found in the queue or not completed");
  }

  // Obtenir l'ID de la file d'attente et la position du client à supprimer
  const { id: queueId, position: removedPosition } = queueToRemove;

  // Supprimer le client de la file d'attente
  await prisma.queue.delete({
    where: { id: queueId },
  });

  // Mettre à jour la position des clients restants dans la file d'attente
  await prisma.queue.updateMany({
    where: {
      hairSalonId: queueToRemove.hairSalonId,
      position: { gt: removedPosition },
    },
    data: {
      position: {
        decrement: 1,
      },
    },
  });

  return `Customer with ID ${customerId} removed from the queue`;
}

export async function removeCustomerFromQueue(queueToRemove) {
  const { id: queueId, position: removedPosition } = queueToRemove;

  await prisma.queue.delete({
    where: { id: queueId },
  });

  await prisma.queue.updateMany({
    where: {
      hairSalonId: queueToRemove.hairSalonId,
      position: { gt: removedPosition },
    },
    data: {
      position: {
        decrement: 1,
      },
    },
  });

  return `Customer with ID ${queueToRemove.customerId} removed from the queue`;
}

export async function removeCanceledCustomerBySalon(customerId) {
  const queueToRemove = await prisma.queue.findFirst({
    where: { customerId: customerId, status: "CANCELED" },
  });

  if (!queueToRemove) {
    throw new Error("Customer not found in the queue or not canceled");
  }

  return removeCustomerFromQueue(queueToRemove);
}

export async function removeCanceledCustomerByCustomer(customerId) {
  const queueToRemove = await prisma.queue.findFirst({
    where: { customerId: customerId, status: "CANCELED" },
  });

  if (!queueToRemove) {
    throw new Error("Customer not found in the queue or not canceled");
  }

  // Vérifier si le client a le droit d'annuler la file d'attente
  const now: Date = new Date();
  const appointmentTime: Date = new Date(queueToRemove.date);
  const diffInHours = (appointmentTime - now) / 1000 / 60 / 60;

  if (diffInHours < 1) {
    throw new Error(
      "Customer cannot cancel the queue less than 1 hour before the appointment"
    );
  }

  return removeCustomerFromQueue(queueToRemove);
}
