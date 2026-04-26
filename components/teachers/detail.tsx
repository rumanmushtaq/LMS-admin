import {
  Button,
  Card,
  Col,
  Container,
  Divider,
  Grid,
  Row,
  Text,
  User,
  Badge,
  Spacer,
  Loading,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "../../services/admin";
import { Flex } from "../styles/flex";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import Link from "next/link";

export const TeacherDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teacher", id],
    queryFn: () => adminService.getTutorById(id as string),
    enabled: !!id,
  });

  const teacher = response?.data;

  const approveMutation = useMutation({
    mutationFn: (tutorId: string) => adminService.approveTutor(tutorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
      alert("Teacher approved successfully!");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminService.rejectTutor(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
      alert("Teacher rejected.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
      alert("Status updated successfully!");
    },
  });

  const handleApprove = () => {
    if (confirm("Approve this teacher?")) {
      approveMutation.mutate(id as string);
    }
  };

  const handleReject = () => {
    const reason = prompt("Rejection reason (optional):");
    if (reason !== null) {
      rejectMutation.mutate({ id: id as string, reason });
    }
  };

  const handleToggleStatus = () => {
    const newStatus = teacher.status === "active" ? "suspended" : "active";
    if (confirm(`Set status to ${newStatus}?`)) {
      statusMutation.mutate({ id: id as string, status: newStatus });
    }
  };

  if (isLoading)
    return (
      <Flex justify="center" align="center" css={{ height: "400px" }}>
        <Loading size="xl" />
      </Flex>
    );
  if (error) return <Text color="error">Error loading teacher details</Text>;
  if (!teacher) return <Text>Teacher not found</Text>;

  return (
    <Flex
      css={{
        mt: "$5",
        px: "$6",
        "@sm": {
          mt: "$10",
          px: "$16",
        },
      }}
      direction={"column"}
    >
      <Breadcrumbs>
        <Crumb>
          <HouseIcon />
          <Link href={"/"}>
            <CrumbLink href="#">Home</CrumbLink>
          </Link>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <UsersIcon />
          <Link href={"/teachers"}>
            <CrumbLink href="#">Teachers</CrumbLink>
          </Link>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CrumbLink href="#">
            {teacher.firstName} {teacher.lastName}
          </CrumbLink>
        </Crumb>
      </Breadcrumbs>

      <Grid.Container gap={2} css={{ mt: "$10" }}>
        {/* Left Column: Profile Card */}
        <Grid xs={12} md={4}>
          <Card css={{ p: "$6" }}>
            <Card.Header>
              <User
                src={teacher.avatar}
                name={`${teacher.firstName} ${teacher.lastName}`}
                description={teacher.email}
                size="xl"
                css={{ p: 0 }}
              />
            </Card.Header>
            <Card.Body css={{ paddingTop: "$10", paddingBottom: "$10" }}>
              <Flex direction="column" css={{ gap: "$4" }}>
                <Flex justify="between" align="center">
                  <Text b>Status</Text>
                  <Badge
                    color={
                      teacher.status === "active"
                        ? "success"
                        : teacher.status === "suspended"
                          ? "error"
                          : "warning"
                    }
                    variant="flat"
                  >
                    {teacher.status.toUpperCase()}
                  </Badge>
                </Flex>
                <Flex justify="between" align="center">
                  <Text b>Role</Text>
                  <Text css={{ tt: "capitalize" }}>{teacher.role}</Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text b>Email Verified</Text>
                  <Badge
                    color={teacher.emailVerified ? "success" : "error"}
                    variant="flat"
                  >
                    {teacher.emailVerified ? "YES" : "NO"}
                  </Badge>
                </Flex>
                <Divider css={{ my: "$4" }} />
                <Text b size={14}>
                  Actions
                </Text>
                <Flex direction="column" css={{ gap: "$3", mt: "$2" }}>
                  {teacher.status === "pending" && (
                    <>
                      <Button auto color="success" onPress={handleApprove} flat>
                        Approve Teacher
                      </Button>
                      <Button auto color="error" onPress={handleReject} flat>
                        Reject Teacher
                      </Button>
                    </>
                  )}
                  <Button
                    auto
                    color={teacher.status === "active" ? "warning" : "success"}
                    onPress={handleToggleStatus}
                  >
                    {teacher.status === "active"
                      ? "Suspend Account"
                      : "Activate Account"}
                  </Button>
                  <Button auto color="error" bordered>
                    Delete Teacher
                  </Button>
                </Flex>
              </Flex>
            </Card.Body>
          </Card>
        </Grid>

        {/* Right Column: Other Details */}
        <Grid xs={12} md={8}>
          <Card css={{ p: "$6" }}>
            <Card.Body>
              <Text h4>Registration Details</Text>
              <Spacer y={1} />
              <Grid.Container gap={2}>
                <Grid xs={12} sm={6}>
                  <Flex direction="column">
                    <Text color="$accents7" size={12}>
                      JOINED AT
                    </Text>
                    <Text b>
                      {new Date(teacher.createdAt).toLocaleString()}
                    </Text>
                  </Flex>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Flex direction="column">
                    <Text color="$accents7" size={12}>
                      ONBOARDING STEP
                    </Text>
                    <Text b css={{ tt: "capitalize" }}>
                      {teacher.onboardingStep?.replace("_", " ") || "N/A"}
                    </Text>
                  </Flex>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Flex direction="column">
                    <Text color="$accents7" size={12}>
                      US PERSON
                    </Text>
                    <Text b>
                      {teacher.isUSPerson
                        ? "Yes"
                        : teacher.isUSPerson === false
                          ? "No"
                          : "N/A"}
                    </Text>
                  </Flex>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Flex direction="column">
                    <Text color="$accents7" size={12}>
                      TAX FORM
                    </Text>
                    <Text b>{teacher.taxFormType || "N/A"}</Text>
                  </Flex>
                </Grid>
              </Grid.Container>

              <Spacer y={2} />
              <Divider />
              <Spacer y={2} />

              <Text h4>Documents & Compliance</Text>
              <Spacer y={1} />
              <Flex direction="column" css={{ gap: "$4" }}>
                <Flex justify="between" align="center">
                  <Text>Tax Form URL</Text>
                  {teacher.taxFormUrl ? (
                    <Button
                      size="sm"
                      flat
                      as="a"
                      href={teacher.taxFormUrl}
                      target="_blank"
                    >
                      View Document
                    </Button>
                  ) : (
                    <Text color="$accents7">Not uploaded</Text>
                  )}
                </Flex>
                <Flex justify="between" align="center">
                  <Text>Signed Contract</Text>
                  {teacher.contractSignatureUrl ? (
                    <Button
                      size="sm"
                      flat
                      as="a"
                      href={teacher.contractSignatureUrl}
                      target="_blank"
                    >
                      View Contract
                    </Button>
                  ) : (
                    <Text color="$accents7">Not signed</Text>
                  )}
                </Flex>
                <Flex direction="column" css={{ gap: "$2" }}>
                  <Text>
                    KYC Documents ({teacher.kycDocuments?.length || 0})
                  </Text>
                  <Flex wrap="wrap" css={{ gap: "$3" }}>
                    {teacher.kycDocuments?.map((doc: string, idx: number) => (
                      <Button
                        key={idx}
                        size="sm"
                        bordered
                        color="secondary"
                        as="a"
                        href={doc}
                        target="_blank"
                      >
                        Document {idx + 1}
                      </Button>
                    ))}
                    {(!teacher.kycDocuments ||
                      teacher.kycDocuments.length === 0) && (
                      <Text color="$accents7" size={14}>
                        No documents uploaded
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Flex>
  );
};
