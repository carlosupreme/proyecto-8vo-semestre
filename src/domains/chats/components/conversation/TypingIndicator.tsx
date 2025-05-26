import {motion} from "framer-motion";

export const TypingIndicator = () => (
    <div className="flex items-center space-x-2 px-4 py-2">
        <div className="flex space-x-1">
            <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{y: [0, -5, 0]}}
                transition={{duration: 0.6, repeat: Infinity, delay: 0}}
            />
            <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{y: [0, -5, 0]}}
                transition={{duration: 0.6, repeat: Infinity, delay: 0.2}}
            />
            <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{y: [0, -5, 0]}}
                transition={{duration: 0.6, repeat: Infinity, delay: 0.4}}
            />
        </div>
        <span className="text-sm text-gray-500">Escribiendo...</span>
    </div>
);
