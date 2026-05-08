import React from "react";
import {
  Modal,
  Text,
  Button,
  Row,
  Col,
  Badge,
  Link,
  Divider,
  Image,
} from "@nextui-org/react";

interface Props {
  user: any;
  onVisible: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const TeacherVerificationModal = ({
  user,
  onVisible,
  onClose,
  onApprove,
  onReject,
}: Props) => {
  if (!user) return null;

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      width="800px"
      open={onVisible}
      onClose={onClose}
    >
      <Modal.Header>
        <Col css={{ overflow: "hidden" }}>
          <Text id="modal-title" size={18}>
            Teacher Verification Review
          </Text>
          <Text b size={14} color="gray">
            {user.firstName} {user.lastName} ({user.email})
          </Text>
        </Col>
      </Modal.Header>
      <Divider />
      <Modal.Body>
        <Col
          css={{
            gap: "$8",
            display: "flex",
            flexDirection: "column",
            py: "$4",
          }}
        >
          {/* Residency */}
          <Row justify="space-between" align="center">
            <Text b>Tax Residency Status:</Text>
            <Badge
              color={user.isUSPerson ? "primary" : "secondary"}
              variant="flat"
            >
              {user.isUSPerson ? "US Citizen/Resident" : "Non-US"}
            </Badge>
          </Row>

          {/* Documents Section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Contract */}
            <Col
              css={{
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <Text b size={14}>
                Signature (Contract)
              </Text>
              {user.contractSignatureUrl ? (
                <div
                  style={{
                    marginTop: "10px",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    background: "#f9f9f9",
                  }}
                >
                  <Image
                    src={user.contractSignatureUrl}
                    alt="Signature"
                    width="100%"
                    height={100}
                    objectFit="contain"
                  />
                </div>
              ) : (
                <Text color="error" size={12}>
                  Not Signed
                </Text>
              )}
            </Col>

            {/* Tax Form */}
            <Col
              css={{
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <Text b size={14}>
                Tax Form ({user.taxFormType || "W8/W9"})
              </Text>
              {user.taxFormUrl ? (
                <div style={{ marginTop: "10px" }}>
                  <Button
                    auto
                    size="sm"
                    as={Link}
                    href={user.taxFormUrl}
                    target="_blank"
                    flat
                  >
                    View Document
                  </Button>
                </div>
              ) : (
                <Text color="error" size={12}>
                  Not Uploaded
                </Text>
              )}
            </Col>
          </div>

          {/* KYC Documents */}
          <Col
            css={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Text b size={14}>
              KYC Identity Documents
            </Text>
            <Row gap={2} css={{ mt: "$4" }}>
              {user.kycDocuments && user.kycDocuments.length > 0 ? (
                user.kycDocuments.map((doc: string, i: number) => (
                  <Col
                    key={i}
                    css={{
                      width: "100px",
                      height: "100px",
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <Link href={doc} target="_blank">
                      <Image
                        src={doc}
                        alt={`KYC ${i}`}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                    </Link>
                  </Col>
                ))
              ) : (
                <Text color="error" size={12}>
                  No KYC Documents
                </Text>
              )}
            </Row>
          </Col>

          {/* KYC Data */}
          {user.kycData && (
            <Col
              css={{
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "16px",
                bg: "#fcfcfc",
              }}
            >
              <Text b size={14}>
                ID Details
              </Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Text size={12}>
                  ID Type: <b>{user.kycData.idType}</b>
                </Text>
                <Text size={12}>
                  ID Number: <b>{user.kycData.idNumber}</b>
                </Text>
                <Text size={12}>
                  Issue Date: <b>{user.kycData.issueDate}</b>
                </Text>
                <Text size={12}>
                  Expiry Date: <b>{user.kycData.expiryDate}</b>
                </Text>
              </div>
            </Col>
          )}
        </Col>
      </Modal.Body>
      <Divider />
      <Modal.Footer>
        <Button
          auto
          flat
          color="error"
          onClick={() => onReject(user._id || user.id)}
        >
          Reject / Suspend
        </Button>
        <Button auto onClick={() => onApprove(user._id || user.id)}>
          Approve & Verify
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
