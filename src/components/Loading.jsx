import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import './Loading.css';

const Loading = ({ fullPage = false }) => {
    return (
        <div className={`loading-container ${fullPage ? 'full-page' : ''}`}>
            <motion.div
                className="loading-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="loader-visual">
                    <motion.div
                        className="loader-ring"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="loader-icon-wrapper"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <BookOpen size={40} className="loader-icon" />
                    </motion.div>
                </div>
                <div className="loader-info">
                    <motion.h3
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Lumina<span>Books</span>
                    </motion.h3>
                    <motion.p
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Opening a world of stories...
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

export default Loading;
