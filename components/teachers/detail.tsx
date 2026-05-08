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
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "../../services/admin";
import { StatusConfirmModal } from "./status-confirm-modal";
import { Flex } from "../styles/flex";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileCheck,
  Globe,
  GraduationCap,
  ShieldCheck,
  Video,
  Clock,
  DollarSign,
  Mail,
  UserCircle,
} from "lucide-react";

export const TeacherDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"active" | "suspended">(
    "active",
  );

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
  console.log(
    "TeacherDetail: ID from router:",
    id,
    "Teacher from query:",
    teacher?.email,
    "Status:",
    teacher?.status,
  );

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
    onSuccess: (response) => {
      // response might be { success: true, data: user, timestamp: ... } due to backend interceptor
      const updatedUser = response?.data || response;
      console.log("statusMutation onSuccess: Updated user:", updatedUser);

      if (updatedUser) {
        queryClient.setQueryData(["teacher", id], (oldData: any) => {
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
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      alert("Teacher profile deleted successfully.");
      router.push("/teachers");
    },
    onError: (err: any) => {
      alert(
        err?.response?.data?.message || "Failed to delete teacher profile.",
      );
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
    console.log(
      "handleToggleStatus: Current status:",
      teacher.status,
      "New status:",
      newStatus,
    );
    setPendingStatus(newStatus);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = () => {
    console.log(
      "handleConfirmStatusChange: Calling mutate with status:",
      pendingStatus,
    );
    statusMutation.mutate(
      { id: id as string, status: pendingStatus },
      {
        onSuccess: (data) => {
          console.log(
            "handleConfirmStatusChange: Mutation success. Response:",
            data,
          );
          setIsStatusModalOpen(false);
        },
        onError: (err: any) => {
          console.error("handleConfirmStatusChange: Mutation error:", err);
          alert(
            "Error updating status: " +
              (err?.response?.data?.message || err.message),
          );
        },
      },
    );
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this profile? This action cannot be undone and will permanently remove the user and their associated data.",
      )
    ) {
      deleteMutation.mutate(id as string);
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
          <Link href={"/teachers"}>
            <CrumbLink>Teachers</CrumbLink>
          </Link>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CrumbLink>
            {teacher.firstName} {teacher.lastName}
          </CrumbLink>
        </Crumb>
      </Breadcrumbs>

      <Grid.Container gap={2} css={{ mt: "$10" }}>
        {/* Left Column: Profile & Actions */}
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
                    src={teacher.kycData?.photoUrl || teacher.avatar}
                    name={`${teacher.firstName} ${teacher.lastName}`}
                    description={teacher.email}
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
                        teacher.status === "active"
                          ? "success"
                          : teacher.status === "suspended"
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
                      {teacher.status.toUpperCase()}
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
                      {new Date(teacher.createdAt).toLocaleDateString()}
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
                      color={teacher.emailVerified ? "primary" : "error"}
                      variant="flat"
                      css={{ borderRadius: "10px", fontWeight: "$bold" }}
                    >
                      {teacher.emailVerified ? "YES" : "NO"}
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
                    {teacher.status === "pending" && (
                      <Flex css={{ gap: "$4" }}>
                        <Button
                          auto
                          color="primary"
                          onPress={handleApprove}
                          css={{
                            flex: 1,
                            borderRadius: "16px",
                            fontWeight: "$black",
                            height: "$14",
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          auto
                          color="error"
                          onPress={handleReject}
                          flat
                          css={{
                            flex: 1,
                            borderRadius: "16px",
                            fontWeight: "$black",
                            height: "$14",
                          }}
                        >
                          Reject
                        </Button>
                      </Flex>
                    )}
                    <Button
                      auto
                      color={teacher.status === "active" ? "error" : "primary"}
                      onPress={handleToggleStatus}
                      flat={teacher.status === "active"}
                      css={{
                        borderRadius: "16px",
                        fontWeight: "$black",
                        height: "$14",
                      }}
                    >
                      {teacher.status === "active"
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
                  </Flex>
                </Flex>
              </Card.Body>
            </Card>

            {/* Financial Details Mini Card */}
            <Card
              css={{
                p: "$8",
                borderRadius: "32px",
                border: "1px solid $border",
                boxShadow: "$md",
              }}
            >
              <Flex align="center" css={{ gap: "$3", mb: "$6" }}>
                <CreditCard size={22} color="var(--nextui-colors-primary)" />
                <Text b size={20}>
                  Financial Info
                </Text>
              </Flex>
              {teacher.kycData?.bankAccount ? (
                <Flex direction="column" css={{ gap: "$5" }}>
                  <Flex direction="column">
                    <Text
                      size={10}
                      b
                      color="$accents7"
                      css={{ tt: "uppercase" }}
                    >
                      Bank Name
                    </Text>
                    <Text b color="$primary">
                      {teacher.kycData.bankAccount.bankName || "N/A"}
                    </Text>
                  </Flex>
                  <Flex direction="column">
                    <Text
                      size={10}
                      b
                      color="$accents7"
                      css={{ tt: "uppercase" }}
                    >
                      Account Number
                    </Text>
                    <Text b>
                      {teacher.kycData.bankAccount.accountNumber || "N/A"}
                    </Text>
                  </Flex>
                  <Flex direction="column">
                    <Text
                      size={10}
                      b
                      color="$accents7"
                      css={{ tt: "uppercase" }}
                    >
                      Account Holder
                    </Text>
                    <Text b>
                      {teacher.kycData.bankAccount.accountHolderName || "N/A"}
                    </Text>
                  </Flex>
                </Flex>
              ) : (
                <Flex direction="column" align="center" css={{ py: "$4" }}>
                  <Text color="$accents7" css={{ fontStyle: "italic" }}>
                    No bank details provided
                  </Text>
                </Flex>
              )}
            </Card>
          </Flex>
        </Grid>

        {/* Right Column: Detailed Information */}
        <Grid xs={12} md={8}>
          <Flex direction="column" css={{ gap: "$8", width: "100%" }}>
            {/* Professional Overview */}
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
                    Professional Profile
                  </Text>
                  <Text color="$accents8">
                    Comprehensive details submitted by tutor
                  </Text>
                </Flex>
                <Badge
                  color="primary"
                  variant="flat"
                  css={{ borderRadius: "12px", px: "$6", height: "$12" }}
                >
                  <Text b color="primary">
                    {teacher.kycData?.category || "Tutor"}
                  </Text>
                </Badge>
              </Flex>

              <Grid.Container gap={4}>
                <Grid xs={12} sm={4}>
                  <Card
                    variant="flat"
                    css={{ p: "$6", borderRadius: "24px", bg: "$primaryLight" }}
                  >
                    <Flex direction="column" align="center">
                      <DollarSign
                        size={24}
                        color="var(--nextui-colors-primary)"
                      />
                      <Spacer y={0.2} />
                      <Text
                        size={12}
                        b
                        color="$accents7"
                        css={{ tt: "uppercase" }}
                      >
                        Hourly Rate
                      </Text>
                      <Text h3 css={{ color: "$primary", mb: 0 }}>
                        ${teacher.kycData?.pricePerHour || "0"}
                      </Text>
                    </Flex>
                  </Card>
                </Grid>
                <Grid xs={12} sm={4}>
                  <Card
                    variant="flat"
                    css={{ p: "$6", borderRadius: "24px", bg: "$accents1" }}
                  >
                    <Flex direction="column" align="center">
                      <Briefcase
                        size={24}
                        color="var(--nextui-colors-primary)"
                      />
                      <Spacer y={0.2} />
                      <Text
                        size={12}
                        b
                        color="$accents7"
                        css={{ tt: "uppercase" }}
                      >
                        Experience
                      </Text>
                      <Text h4 css={{ mb: 0 }}>
                        {teacher.kycData?.experience || "N/A"}
                      </Text>
                    </Flex>
                  </Card>
                </Grid>
                <Grid xs={12} sm={4}>
                  <Card
                    variant="flat"
                    css={{ p: "$6", borderRadius: "24px", bg: "$accents1" }}
                  >
                    <Flex direction="column" align="center">
                      <Globe size={24} color="var(--nextui-colors-primary)" />
                      <Spacer y={0.2} />
                      <Text
                        size={12}
                        b
                        color="$accents7"
                        css={{ tt: "uppercase" }}
                      >
                        Languages
                      </Text>
                      <Text h4 css={{ mb: 0 }}>
                        {teacher.kycData?.nativeLanguage || "English"}
                      </Text>
                    </Flex>
                  </Card>
                </Grid>

                <Grid xs={12}>
                  <Flex direction="column" css={{ gap: "$3" }}>
                    <Flex align="center" css={{ gap: "$2" }}>
                      <UserCircle
                        size={20}
                        color="var(--nextui-colors-primary)"
                      />
                      <Text b size={18}>
                        About Me
                      </Text>
                    </Flex>
                    <Text
                      css={{
                        lineHeight: "$lg",
                        color: "$accents9",
                        fontSize: "$md",
                        fontStyle: "italic",
                      }}
                    >
                      &quot;{teacher.kycData?.aboutMe || "No bio provided."}
                      &quot;
                    </Text>
                  </Flex>
                </Grid>

                {teacher.kycData?.introVideoUrl && (
                  <Grid xs={12}>
                    <Flex direction="column" css={{ gap: "$4" }}>
                      <Flex align="center" css={{ gap: "$2" }}>
                        <Video size={20} color="var(--nextui-colors-primary)" />
                        <Text b size={18}>
                          Introduction Video
                        </Text>
                      </Flex>
                      <Button
                        auto
                        flat
                        as="a"
                        href={teacher.kycData.introVideoUrl}
                        target="_blank"
                        css={{
                          borderRadius: "16px",
                          px: "$10",
                          width: "fit-content",
                        }}
                        icon={<Video size={20} />}
                      >
                        Watch Onboarding Video
                      </Button>
                    </Flex>
                  </Grid>
                )}
              </Grid.Container>
            </Card>

            {/* Availability */}
            <Card
              css={{
                p: "$10",
                borderRadius: "32px",
                border: "1px solid $border",
                boxShadow: "$md",
              }}
            >
              <Flex align="center" css={{ gap: "$3", mb: "$6" }}>
                <Clock size={24} color="var(--nextui-colors-primary)" />
                <Text h3>Teaching Availability</Text>
              </Flex>
              {teacher.kycData?.availability &&
              teacher.kycData.availability.length > 0 ? (
                <Grid.Container gap={3}>
                  {teacher.kycData.availability.map((day: any, idx: number) => (
                    <Grid xs={12} sm={4} lg={3} key={idx}>
                      <Card
                        variant="flat"
                        css={{
                          p: "$5",
                          borderRadius: "20px",
                          bg: "$primaryLight",
                          border: "1px solid rgba(112, 71, 235, 0.1)",
                        }}
                      >
                        <Flex direction="column" align="center">
                          <Text b size={15} color="$primary">
                            {day.day}
                          </Text>
                          <Spacer y={0.1} />
                          <Text size={12} b color="$accents8">
                            {day.startTime} - {day.endTime}
                          </Text>
                        </Flex>
                      </Card>
                    </Grid>
                  ))}
                </Grid.Container>
              ) : (
                <Flex justify="center" css={{ py: "$8" }}>
                  <Text color="$accents7" css={{ fontStyle: "italic" }}>
                    No availability schedule set yet.
                  </Text>
                </Flex>
              )}
            </Card>

            {/* Education & Background */}
            <Card
              css={{
                p: "$10",
                borderRadius: "32px",
                border: "1px solid $border",
                boxShadow: "$md",
              }}
            >
              <Flex align="center" css={{ gap: "$3", mb: "$8" }}>
                <GraduationCap size={24} color="var(--nextui-colors-primary)" />
                <Text h3>Education & Expertise</Text>
              </Flex>
              <Flex direction="column" css={{ gap: "$8" }}>
                <Card
                  variant="flat"
                  css={{ p: "$6", borderRadius: "24px", bg: "$accents1" }}
                >
                  <Text
                    b
                    size={14}
                    color="$accents7"
                    css={{ tt: "uppercase", mb: "$2", display: "block" }}
                  >
                    Academic Background
                  </Text>
                  <Text b size={18}>
                    {teacher.kycData?.education || "Not specified"}
                  </Text>
                </Card>

                <Flex direction="column">
                  <Flex align="center" css={{ gap: "$2", mb: "$4" }}>
                    <Award size={20} color="var(--nextui-colors-primary)" />
                    <Text b size={18}>
                      Official Certifications
                    </Text>
                  </Flex>
                  {(teacher.kycData?.certifications || []).length > 0 ? (
                    <Flex wrap="wrap" css={{ gap: "$4" }}>
                      {teacher.kycData.certifications.map(
                        (cert: string, idx: number) => (
                          <Button
                            key={idx}
                            auto
                            bordered
                            color="primary"
                            as="a"
                            href={cert}
                            target="_blank"
                            css={{ borderRadius: "14px", fontWeight: "$bold" }}
                            icon={<FileCheck size={18} />}
                          >
                            Certificate {idx + 1}
                          </Button>
                        ),
                      )}
                    </Flex>
                  ) : (
                    <Text color="$accents7" css={{ fontStyle: "italic" }}>
                      No professional certifications uploaded.
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Card>

            {/* Verification Documents */}
            <Card
              css={{
                p: "$10",
                borderRadius: "32px",
                border: "1px solid $border",
                boxShadow: "$md",
                bg: "rgba(112, 71, 235, 0.02)",
              }}
            >
              <Flex align="center" css={{ gap: "$3", mb: "$8" }}>
                <FileCheck size={24} color="var(--nextui-colors-primary)" />
                <Text h3>Identity & Compliance</Text>
              </Flex>
              <Grid.Container gap={4}>
                <Grid xs={12} sm={6}>
                  <Card
                    variant="flat"
                    css={{ p: "$6", borderRadius: "24px", bg: "$accents1" }}
                  >
                    <Text
                      size={10}
                      b
                      color="$accents7"
                      css={{ tt: "uppercase", mb: "$1" }}
                    >
                      ID Document Type
                    </Text>
                    <Text b size={16}>
                      {teacher.kycData?.idType || "N/A"}
                    </Text>
                  </Card>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Card
                    variant="flat"
                    css={{ p: "$6", borderRadius: "24px", bg: "$accents1" }}
                  >
                    <Text
                      size={10}
                      b
                      color="$accents7"
                      css={{ tt: "uppercase", mb: "$1" }}
                    >
                      ID Number
                    </Text>
                    <Text b size={16}>
                      {teacher.kycData?.idNumber || "N/A"}
                    </Text>
                  </Card>
                </Grid>
                <Grid xs={12}>
                  <Text b size={16} css={{ mb: "$4" }}>
                    Verification Assets
                  </Text>
                  <Flex wrap="wrap" css={{ gap: "$4" }}>
                    {teacher.kycData?.idFrontUrl && (
                      <Button
                        as="a"
                        href={teacher.kycData.idFrontUrl}
                        target="_blank"
                        flat
                        color="primary"
                        css={{ borderRadius: "12px" }}
                      >
                        ID Front
                      </Button>
                    )}
                    {teacher.kycData?.idBackUrl && (
                      <Button
                        as="a"
                        href={teacher.kycData.idBackUrl}
                        target="_blank"
                        flat
                        color="primary"
                        css={{ borderRadius: "12px" }}
                      >
                        ID Back
                      </Button>
                    )}
                    {teacher.kycData?.selfieUrl && (
                      <Button
                        as="a"
                        href={teacher.kycData.selfieUrl}
                        target="_blank"
                        flat
                        color="primary"
                        css={{ borderRadius: "12px" }}
                      >
                        Verif. Selfie
                      </Button>
                    )}
                    {teacher.taxFormUrl && (
                      <Button
                        as="a"
                        href={teacher.taxFormUrl}
                        target="_blank"
                        flat
                        color="warning"
                        css={{ borderRadius: "12px" }}
                      >
                        Tax Form ({teacher.taxFormType})
                      </Button>
                    )}
                    {teacher.contractSignatureUrl && (
                      <Button
                        as="a"
                        href={teacher.contractSignatureUrl}
                        target="_blank"
                        flat
                        color="success"
                        css={{ borderRadius: "12px" }}
                      >
                        Legal Contract
                      </Button>
                    )}
                  </Flex>
                </Grid>
              </Grid.Container>
            </Card>
          </Flex>
        </Grid>
      </Grid.Container>

      <StatusConfirmModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus}
        isLoading={statusMutation.isPending}
      />
    </Flex>
  );
};
