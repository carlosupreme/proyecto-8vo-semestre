import type {Message} from "@/domains/chats/types.ts";
import {useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Smile} from "lucide-react";
import {motion} from "framer-motion";

export const MessageReactions = ({ reactions, messageId, onReact }: {
    reactions: Message['reactions'];
    messageId: string;
    onReact: (messageId: string, emoji: string) => void;
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const emojis = ['❤️', '👍', '😂', '😢', '😡'];

    if (!reactions || Object.keys(reactions).length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(reactions).map(([emoji, users]) => (
                <motion.button
                    key={emoji}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 transition-colors"
                    onClick={() => onReact(messageId, emoji)}
                >
                    <span>{emoji}</span>
                    <span className="text-gray-600">{users.length}</span>
                </motion.button>
            ))}
            <DropdownMenu open={showPicker} onOpenChange={setShowPicker}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                        <Smile className="w-3 h-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <div className="flex gap-1 p-2">
                        {emojis.map(emoji => (
                            <button
                                key={emoji}
                                className="hover:bg-gray-100 p-1 rounded transition-colors"
                                onClick={() => {
                                    onReact(messageId, emoji);
                                    setShowPicker(false);
                                }}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};