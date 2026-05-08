import React from "react";
import { TeacherDetail } from "../../components/teachers/detail";

const TeacherDetailPage = () => {
  return <TeacherDetail />;
};

export default TeacherDetailPage;

export const getServerSideProps = async () => {
  return { props: {} };
};
