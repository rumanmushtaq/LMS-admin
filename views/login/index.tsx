import { Button, Input, Text, Loading, Row, Checkbox } from "@nextui-org/react";
import { useLogin } from "./useLogin";

export const LoginView = () => {
  const { form, onSubmit, loading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#ffffff",
        color: "#000",
        overflow: "hidden",
      }}
    >
      {/* Left Side - Login Form */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 10%",
          backgroundColor: "#ffffff",
          zIndex: 10,
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px", margin: "0 auto" }}>
          <Text
            h1
            css={{
              fontWeight: "800",
              mb: "$2",
              color: "#1a1a1a",
              letterSpacing: "1px",
              fontSize: "2.5rem",
            }}
          >
            WELCOME BACK
          </Text>
          <Text size="$lg" css={{ color: "#666", mb: "$14" }}>
            Welcome back! Please enter your details.
          </Text>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Text b size="$sm" css={{ color: "#1a1a1a" }}>
                Email
              </Text>
              <Input
                {...register("email", { required: "Email is required" })}
                bordered
                fullWidth
                size="lg"
                type="email"
                placeholder="Enter your email"
                color={errors.email ? "error" : "default"}
                helperText={errors.email?.message as string}
                css={{
                  borderRadius: "8px",
                  "& input": { backgroundColor: "#f9f9f9", padding: "1rem" },
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Text b size="$sm" css={{ color: "#1a1a1a" }}>
                Password
              </Text>
              <Input.Password
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                bordered
                fullWidth
                size="lg"
                placeholder="*********"
                color={errors.password ? "error" : "default"}
                helperText={errors.password?.message as string}
                css={{
                  borderRadius: "8px",
                  "& input": {
                    backgroundColor: "#f9f9f9",
                    padding: "1rem",
                    letterSpacing: "2px",
                  },
                }}
              />
            </div>

            <Row
              justify="space-between"
              align="center"
              css={{ mt: "$2", mb: "$6" }}
            >
              <Checkbox
                size="sm"
                onChange={(isSelected: boolean) => {
                  form.setValue("rememberMe", isSelected);
                }}
                css={{
                  "& .nextui-checkbox-text": {
                    color: "#444",
                    fontWeight: "500",
                  },
                }}
              >
                Remember me
              </Checkbox>
              <Text
                size="$sm"
                css={{
                  color: "#444",
                  fontWeight: "600",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot password
              </Text>
            </Row>

            <Button
              type="submit"
              css={{
                width: "100%",
                borderRadius: "8px",
                fontWeight: "bold",
                backgroundColor: "#ef4444", // Red color from the design request
                color: "white",
                "&:hover": { backgroundColor: "#dc2626" },
              }}
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "url(/images/lms_hero_light.png) no-repeat center center",
          backgroundSize: "cover",
          position: "relative",
        }}
      ></div>
    </div>
  );
};
