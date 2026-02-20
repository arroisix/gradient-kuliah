import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface SpiderChartProps {
    labels: string[];
    scores: number[];
}

function SpiderChart({ labels, scores }: SpiderChartProps): JSX.Element {
    const data: ChartData<'radar'> = {
        labels,
        datasets: [
            {
                label: 'Skor Kamu',
                data: scores,
                backgroundColor: 'rgba(95,43,206,0.2)', // background fill
                borderColor: '#B6A6F3', // line color
                borderWidth: 2, // line width
                pointBackgroundColor: '#FFFFFF', // dot for each data point
                pointBorderColor: '#FFFFFF', // border around the dot
                pointRadius: 5, // dot size
                hoverRadius: 7 // dot size when hover
            }

            // below is a dashed dataset and it will be used in the future
            // {
            //     label: 'Target Prodi',
            //     data: [755, 455, 655, 855, 879, 657],
            //     backgroundColor: 'transparent',
            //     borderColor: '#4B4E5F',
            //     borderWidth: 2,
            //     borderDash: [5, 5],
            //     pointRadius: 0
            // }
        ]
    };

    const options: ChartOptions<'radar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                // radial line
                angleLines: {
                    display: true,
                    color: '#4B4E5F',
                    lineWidth: 1
                },
                // spiral line
                grid: {
                    color: '#4B4E5F',
                    lineWidth: 1
                },
                // label for data point (Kuantitatif, Matematika, etc.)
                pointLabels: {
                    color: '#FFFFFF',
                    backdropColor: 'transparent',
                    font: { size: 14, lineHeight: '160%' },
                    callback: function (label) {
                        // remove text inside parentheses
                        const cleanedText = label.replace(/\([^)]*\)/g, '');

                        // match words starting with capital letters
                        const matches = cleanedText.match(/\b[A-Z]\w*/g);
                        if (!matches) {
                            return label;
                        }

                        // map to first letter and join
                        return matches.map((word) => word[0]).join('');
                    }
                },
                // tick between spiral line
                ticks: {
                    display: false,
                    stepSize: 250
                },
                min: 0,
                max: 1000
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        }
    };

    return (
        <div className="aspect-square w-full">
            <Radar data={data} options={options} />
        </div>
    );
}

export { SpiderChart };
