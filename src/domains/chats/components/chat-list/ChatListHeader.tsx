import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MoreVertical, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetUser } from "../../../account/hooks/useGetUser";
import { useMutateUser } from "../../../account/hooks/useMutateUser";
import { useWhatsApp } from "../../hooks/useWhatsApp";
import { ConnectWhatsApp } from "../whatsapp/ConnectWhatsApp";
import { ViewWhatsApp } from "../whatsapp/ViewWhatsApp";

interface ChatListHeaderProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

export function ChatListHeader({
  onSearch,
  searchTerm,
}: ChatListHeaderProps) {
  const { data: user } = useGetUser();
  const { mutateAsync: updateUser } = useMutateUser();
  const isAIEnabled = useMemo(() => user?.assistantConfig.enabled, [user]);
  const { isConnected: isWhatsAppConnected } = useWhatsApp();
  const [isViewWhatsApp, setIsViewWhatsApp] = useState(false);
  const [isConnectWhatsApp, setIsConnectWhatsApp] = useState(false);

  const onAIToggle = async () => {
    if (!user) return;

    await updateUser({
      assistantConfig: {
        id: user.assistantConfig.id,
        enabled: !isAIEnabled
      }
    })
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Chats</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full" size="icon">
            <Plus />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full cursor-pointer" size="icon" >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem  >
                {isWhatsAppConnected
                  ? <Button variant="outline" onClick={() => setIsViewWhatsApp(true)}>Ver WhatsApp</Button>
                  : <Button variant="outline" onClick={() => setIsConnectWhatsApp(true)}>Conectar WhatsApp</Button>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAIToggle}>
                {isAIEnabled ? "Apagar" : "Encender"} IA
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search chats..."
          className="pl-8 mt-0 border rounded-2xl"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <ConnectWhatsApp open={isConnectWhatsApp} onOpenChange={setIsConnectWhatsApp} />
      <ViewWhatsApp open={isViewWhatsApp} onOpenChange={setIsViewWhatsApp} />
    </div>
  );
}