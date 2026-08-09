import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
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
import chatService from "../../services/chat";
import { Flex } from "../styles/flex";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import Link from "next/link";
import { Calendar, ShieldCheck, Mail, MessageCircle } from "lucide-react";

export const StudentDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => adminService.getStudentById(id as string),
    enabled: !!id,
  });

  const student = response?.data;

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateStudentStatus(id, status),
    onSuccess: (response) => {
      const updatedUser = response?.data || response;
      if (updatedUser) {
        queryClient.setQueryData(["student", id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: updatedUser,
          };
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteStudent(userId),
    onSuccess: () => {
      alert("Student profile deleted successfully.");
      router.push("/students");
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to delete student profile.");
    },
  });

  const handleToggleStatus = () => {
    const newStatus = student.status === "active" ? "suspended" : "active";
    if (confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'suspend'} this student?`)) {
      statusMutation.mutate({ id: id as string, status: newStatus });
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this profile? This action cannot be undone and will permanently remove the student and their associated data.",
      )
    ) {
      deleteMutation.mutate(id as string);
    }
  };

  const handleStartChat = async () => {
    try {
      const res = await chatService.initConversation(id as string);
      const convId = res?.data?._id || res?._id;
      if (convId) {
        router.push(`/chat?openConversation=${convId}`);
      } else {
        router.push("/chat");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate chat.");
    }
  };

  if (isLoading)
    return (
      <Flex justify="center" align="center" css={{ height: "400px" }}>
        <Loading size="xl" />
      </Flex>
    );
  if (error) return <Text color="error">Error loading student details</Text>;
  if (!student) return <Text>Student not found</Text>;

  const getFullName = () => {
    return (
      `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
      student.name || "Student"
    );
  };

  return (
    <Flex
      css={{
        mt: "$5",
        px: "$6",
        "@sm": {
          mt: "$10",
          px: "$10",
        },
        pb: "$20",
      }}
      direction={"column"}
    >
      <Breadcrumbs>
        <Crumb>
          <HouseIcon />
          <Link href={"/"}>
            <CrumbLink>Home</CrumbLink>
          </Link>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <UsersIcon />
          <Link href={"/students"}>
            <CrumbLink>Students</CrumbLink>
          </Link>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CrumbLink>{getFullName()}</CrumbLink>
        </Crumb>
      </Breadcrumbs>

      <Grid.Container gap={2} css={{ mt: "$10" }}>
        <Grid xs={12} md={4}>
          <Flex direction="column" css={{ gap: "$8", width: "100%" }}>
            <Card
              css={{
                p: "$8",
                borderRadius: "32px",
                border: "1px solid $border",
                boxShadow: "$lg",
              }}
            >
              <Card.Header>
                <Flex direction="column" align="center" css={{ width: "100%" }}>
                  <User
                    src={student.avatar}
                    name={getFullName()}
                    description={student.email}
                    size="xl"
                    css={{
                      p: 0,
                      "& .nextui-user-name": {
                        fontSize: "$lg",
                        fontWeight: "$black",
                      },
                    }}
                  />
                </Flex>
              </Card.Header>
              <Card.Body css={{ paddingTop: "$8", paddingBottom: "$4" }}>
                <Flex direction="column" css={{ gap: "$5" }}>
                  <Flex justify="between" align="center">
                    <Flex align="center" css={{ gap: "$2" }}>
                      <ShieldCheck
                        size={18}
                        color="var(--nextui-colors-primary)"
                      />
                      <Text b color="$accents8">
                        Status
                      </Text>
                    </Flex>
                    <Badge
                      color={
                        student.status === "active"
                          ? "success"
                          : student.status === "suspended"
                            ? "error"
                            : "warning"
                      }
                      variant="flat"
                      css={{
                        borderRadius: "10px",
                        px: "$5",
                        fontWeight: "$bold",
                      }}
                    >
                      {student.status.toUpperCase()}
                    </Badge>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Flex align="center" css={{ gap: "$2" }}>
                      <Calendar
                        size={18}
                        color="var(--nextui-colors-primary)"
                      />
                      <Text b color="$accents8">
                        Joined
                      </Text>
                    </Flex>
                    <Text size={14} b>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Flex align="center" css={{ gap: "$2" }}>
                      <Mail size={18} color="var(--nextui-colors-primary)" />
                      <Text b color="$accents8">
                        Verified
                      </Text>
                    </Flex>
                    <Badge
                      color={student.emailVerified ? "primary" : "error"}
                      variant="flat"
                      css={{ borderRadius: "10px", fontWeight: "$bold" }}
                    >
                      {student.emailVerified ? "YES" : "NO"}
                    </Badge>
                  </Flex>

                  <Divider css={{ my: "$4" }} />

                  <Text
                    b
                    size={14}
                    color="$accents8"
                    css={{ mb: "$2", tt: "uppercase", letterSpacing: "$wider" }}
                  >
                    Quick Management
                  </Text>
                  <Flex direction="column" css={{ gap: "$4" }}>
                    <Button
                      auto
                      color={student.status === "active" ? "error" : "primary"}
                      onPress={handleToggleStatus}
                      flat={student.status === "active"}
                      css={{
                        borderRadius: "16px",
                        fontWeight: "$black",
                        height: "$14",
                      }}
                    >
                      {student.status === "active"
                        ? "Suspend Account"
                        : "Activate Account"}
                    </Button>
                    <Button
                      auto
                      color="error"
                      bordered
                      onPress={handleDelete}
                      css={{
                        borderRadius: "16px",
                        fontWeight: "$black",
                        height: "$14",
                      }}
                    >
                      Delete Profile
                    </Button>
                    <Button
                      auto
                      color="secondary"
                      onPress={handleStartChat}
                      css={{
                        borderRadius: "16px",
                        fontWeight: "$black",
                        height: "$14",
                        bg: "$primary",
                        color: "white"
                      }}
                      icon={<MessageCircle size={20} />}
                    >
                      Chat with Student
                    </Button>
                  </Flex>
                </Flex>
              </Card.Body>
            </Card>
          </Flex>
        </Grid>

        <Grid xs={12} md={8}>
          <Flex direction="column" css={{ gap: "$8", width: "100%" }}>
            <Card
              css={{
                p: "$10",
                borderRadius: "32px",
                border: "1px solid $border",
                boxShadow: "$lg",
              }}
            >
              <Flex justify="between" align="start" css={{ mb: "$6" }}>
                <Flex direction="column">
                  <Text h3 css={{ mb: "$1" }}>
                    Student Profile
                  </Text>
                  <Text color="$accents8">
                    Basic student details and enrollment info
                  </Text>
                </Flex>
                <Badge
                  color="primary"
                  variant="flat"
                  css={{ borderRadius: "12px", px: "$6", height: "$12" }}
                >
                  <Text b color="primary">
                    Student
                  </Text>
                </Badge>
              </Flex>

              <Grid.Container gap={4}>
                <Grid xs={12} sm={6}>
                  <Card
                    variant="flat"
                    css={{ p: "$6", borderRadius: "24px", bg: "$accents1" }}
                  >
                    <Flex direction="column">
                      <Text
                        size={12}
                        b
                        color="$accents7"
                        css={{ tt: "uppercase", mb: "$2" }}
                      >
                        Email Address
                      </Text>
                      <Text h4 css={{ mb: 0 }}>
                        {student.email}
                      </Text>
                    </Flex>
                  </Card>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Card
                    variant="flat"
                    css={{ p: "$6", borderRadius: "24px", bg: "$accents1" }}
                  >
                    <Flex direction="column">
                      <Text
                        size={12}
                        b
                        color="$accents7"
                        css={{ tt: "uppercase", mb: "$2" }}
                      >
                        Phone Number
                      </Text>
                      <Text h4 css={{ mb: 0 }}>
                        {student.phone || "N/A"}
                      </Text>
                    </Flex>
                  </Card>
                </Grid>
              </Grid.Container>
            </Card>
          </Flex>
        </Grid>
      </Grid.Container>
    </Flex>
  );
};
