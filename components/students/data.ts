export const columns = [
  { name: "NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "ENROLLMENT DATE", uid: "createdAt" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "suspended", label: "Suspended" },
];

export const sortOptions = [
  { key: "createdAt", label: "Enrollment Date" },
  { key: "firstName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
];
