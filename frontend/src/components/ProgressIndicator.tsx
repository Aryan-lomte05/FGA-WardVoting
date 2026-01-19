import React from 'react';
import './ProgressIndicator.css';

interface ProgressIndicatorProps {
    currentWard: number;
    totalWards: number;
    wardLabel?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    currentWard,
    totalWards,
    wardLabel = 'Ward'
}) => {
    return (
        <div className="progress-indicator">
            <div className="progress-label">
                {wardLabel} {currentWard} of {totalWards}
            </div>
            <div className="progress-dots">
                {Array.from({ length: totalWards }, (_, i) => i + 1).map((ward) => (
                    <div
                        key={ward}
                        className={`progress-dot ${ward < currentWard ? 'completed' :
                            ward === currentWard ? 'active' :
                                'pending'
                            }`}
                    >
                        {ward < currentWard ? '✓' : ward}
                    </div>
                ))}
            </div>
        </div>
    );
};
