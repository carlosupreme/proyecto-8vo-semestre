import { MessageSquare, SendHorizonal, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center text-center p-8"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="w-24 h-24 rounded-full bg-primary/5 border-4 border-primary/10 flex items-center justify-center mb-6 relative"
      >
        <SendHorizonal className="h-10 w-10 text-primary/50" />
        <motion.div 
          className="absolute -right-2 -top-2 bg-primary/10 rounded-full p-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MessageSquare className="h-5 w-5 text-primary/60" />
        </motion.div>
        <motion.div 
          className="absolute -left-2 -bottom-2 bg-primary/10 rounded-full p-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Users className="h-5 w-5 text-primary/60" />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-2">Selecciona un chat para comenzar</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Elige un chat para comenzar a chatear o crea uno nuevo usando el botón de más en el menú lateral.
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button variant="outline" className="rounded-full" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Ver contactos
          </Button>
          <Button variant="default" className="rounded-full" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Nuevo chat
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
