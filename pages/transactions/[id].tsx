import React from "react";
import { useRouter } from "next/router";
import TransactionDetailPage from "../../components/transactions/detail-page";

const TransactionDetail = () => {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  if (!id) return null;
  return <TransactionDetailPage id={id} />;
};

export default TransactionDetail;
