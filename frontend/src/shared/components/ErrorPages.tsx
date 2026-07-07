import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  code: "404" | "500" | "401";
  title: string;
  description: string;
}

function ErrorPage({ code, title, description }: ErrorPageProps) {
  const navigate = useNavigate();
  const codeColors: Record<string, string> = {
    "404": "from-blue-600 to-cyan-500",
    "500": "from-red-600 to-rose-500",
    "401": "from-amber-600 to-orange-500",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 text-center max-w-md"
      >
        {/* Big error code */}
        <div className={`text-8xl font-black bg-gradient-to-br ${codeColors[code]} bg-clip-text text-transparent`}>
          {code}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Go Back
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="gap-2">
            <Home className="w-4 h-4" /> Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorPage
      code="500"
      title="Internal Server Error"
      description="Something went wrong on our end. Please try again later."
    />
  );
}

export function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized Access"
      description="You don't have permission to access this page. Please login first."
    />
  );
}
