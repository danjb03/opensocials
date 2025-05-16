
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export type InviteLog = {
  id: string;
  email: string;
  role: string;
  status: string;
  sent_at: string;
  error_message?: string;
  triggered_by?: string;
};

// Helper function to format the timestamp
const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  } catch (e) {
    return dateString;
  }
};

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'sent':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'failed':
    case 'email_failed':
      return 'bg-red-500';
    case 'duplicate':
      return 'bg-purple-500';
    case 'email_skipped':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export const columns: ColumnDef<InviteLog>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={`${getStatusColor(status)} text-white capitalize`}>
          {status.replace('_', ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: "sent_at",
    header: "Date",
    cell: ({ row }) => {
      return formatDate(row.getValue("sent_at") as string);
    },
  },
  {
    accessorKey: "error_message",
    header: "Details",
    cell: ({ row }) => {
      const errorMessage = row.original.error_message;
      if (!errorMessage) return null;
      
      return (
        <span className="text-sm text-gray-500 max-w-[200px] truncate block" title={errorMessage}>
          {errorMessage}
        </span>
      );
    },
  },
];
