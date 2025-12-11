import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Chatbot } from "@/components/chatbot";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="h-screen">
          <Chatbot />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
