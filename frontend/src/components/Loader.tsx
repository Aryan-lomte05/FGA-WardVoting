import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

interface LoaderProps {
    onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500); // 2.5s loader duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="loader-container">
            <motion.div
                className="loader-content"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="loader-logo"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 0, 0, 360],
                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                >
                    ⚡
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Aryan's EVM
                </motion.h1>

                <motion.div
                    className="loading-bar-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <motion.div
                        className="loading-bar"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </motion.div>

                <motion.p
                    className="loader-status"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Initializing Secure Voting Protocols...
                </motion.p>
            </motion.div>
        </div>
    );
};
