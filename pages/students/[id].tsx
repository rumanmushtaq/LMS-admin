import React from "react";
import { StudentDetail } from "../../components/students/detail";

const StudentDetailPage = () => {
  return <StudentDetail />;
};

export default StudentDetailPage;

export const getServerSideProps = async () => {
  return { props: {} };
};
