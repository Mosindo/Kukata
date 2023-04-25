import { NextApiRequest, NextApiResponse } from "next";
import {
  createQueue,
  getQueueById,
  getAllQueues,
  updateQueue,
  removeCompletedCustomer,
  removeCanceledCustomerBySalon,
  removeCanceledCustomerByCustomer,
} from "../../lib/queue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const queues = await getAllQueues();
        res.status(200).json(queues);
      } catch (error) {
        res.status(500).json({ errorMessage: "Failed to get queues" });
      }
      break;

    case "POST":
      try {
        const queueInput = req.body;
        const newQueue = await createQueue(queueInput);
        res.status(201).json(newQueue);
      } catch (error) {
        res.status(500).json({ errorMessage: "Failed to create queue" });
      }
      break;

    case "PUT":
      try {
        const queueId = parseInt(req.query.id as string);
        const queueInput = req.body;
        const updatedQueue = await updateQueue(queueId, queueInput);
        res.status(200).json(updatedQueue);
      } catch (error) {
        res.status(500).json({ errorMessage: "Failed to update queue" });
      }
      break;

    case "DELETE":
      try {
        const customerId = parseInt(req.query.customerId as string);
        const action = req.query.action as string;

        let message = "";

        if (action === "complete") {
          message = await removeCompletedCustomer(customerId);
        } else if (action === "cancelBySalon") {
          message = await removeCanceledCustomerBySalon(customerId);
        } else if (action === "cancelByCustomer") {
          message = await removeCanceledCustomerByCustomer(customerId);
        } else {
          throw new Error("Invalid action");
        }

        res.status(200).json({ message });
      } catch (error: any) {
        res.status(500).json({ errorMessage: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ errorMessage: `Method ${method} Not Allowed` });
  }
}
