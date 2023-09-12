import { NextApiRequest, NextApiResponse } from "next";
import {
  createQueue,
  getQueueById,
  getAllQueues,
  updateQueue,
  removeCompletedCustomer,
  removeCanceledCustomerBySalon,
  removeCanceledCustomerByCustomer,
} from "../../../lib/queue";
import { NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { method } = req;

//   switch (method) {
//     case "GET":
//       try {
//         if (req.query.id) {
//           const queue = await getQueueById(Number(req.query.id));
//           res.status(200).json(queue);
//         } else {
//           const queues = await getAllQueues();
//           res.status(200).json(queues);
//         }
//         break;
//       } catch (error) {
//         res.status(500).json({ errorMessage: "Failed to get queues" });
//       }
//       break;

//     case "POST":
//       try {
//         const queueInput = req.body;
//         const newQueue = await createQueue(queueInput);
//         res.status(201).json(newQueue);
//       } catch (error) {
//         res.status(500).json({ errorMessage: "Failed to create queue" });
//       }
//       break;

//     case "PUT":
//       try {
//         const queueId = parseInt(req.query.id as string);
//         const queueInput = req.body;
//         const updatedQueue = await updateQueue(queueId, queueInput);
//         res.status(200).json(updatedQueue);
//       } catch (error) {
//         res.status(500).json({ errorMessage: "Failed to update queue" });
//       }
//       break;

//     case "DELETE":
//       try {
//         const customerId = parseInt(req.query.customerId as string);
//         const action = req.query.action as string;

//         let message = "";

//         if (action === "complete") {
//           message = await removeCompletedCustomer(customerId);
//         } else if (action === "cancelBySalon") {
//           message = await removeCanceledCustomerBySalon(customerId);
//         } else if (action === "cancelByCustomer") {
//           message = await removeCanceledCustomerByCustomer(customerId);
//         } else {
//           throw new Error("Invalid action");
//         }

//         res.status(200).json({ message });
//       } catch (error: any) {
//         res.status(500).json({ errorMessage: error.message });
//       }
//       break;

//     default:
//       res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
//       res.status(405).json({ errorMessage: `Method ${method} Not Allowed` });
//   }
// }

export async function GET(req: Request) {
  try {
    if (req.url.slice(req.url.lastIndexOf("/") + 1)) {
      const queue = await getQueueById(
        Number(req.url.slice(req.url.lastIndexOf("/") + 1))
      );
      return NextResponse.json(queue, { status: 200 });
    } else {
      const queues = await getAllQueues();
      return NextResponse.json(queues, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Failed to get queues" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const queueInput = await req.json();
    const newQueue = await createQueue(queueInput);
    return NextResponse.json(newQueue, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Failed to create queue" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const queueId = parseInt(
      req.url.slice(req.url.lastIndexOf("/") + 1) as string
    );
    const queueInput = await req.json();
    const updatedQueue = await updateQueue(queueId, queueInput);
    return NextResponse.json(updatedQueue, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Failed to update queue" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const customerId = parseInt(
      req.url.slice(req.url.lastIndexOf("/") + 1) as string
    );
    const action = req.url.slice(req.url.lastIndexOf("/") + 1);

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

    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 500 });
  }
}
