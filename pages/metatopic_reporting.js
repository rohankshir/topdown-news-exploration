import React from 'react';
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import 'chartjs-adapter-moment';
import { getTimeSeriesData, getAnnotations } from '../lib/data';
import { useRef, useState } from 'react';
import { color, transparentize } from '../lib/utils';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    TimeScale
} from 'chart.js';
import { Line, getElementAtEvent } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    TimeScale,
    annotationPlugin
);

function chunkHeadline(str, numChunks) {
    const tokens = str.split(' ');
    const numWordsInChunk = Math.floor(tokens.length / numChunks);
    const chunks = new Array(numChunks);

    for (let i = 0; i <= numChunks; ++i) {
        if (i < numChunks) {
            chunks[i] = tokens.slice(i * numWordsInChunk, i * numWordsInChunk + numWordsInChunk).join(' ')
        }
        else {
            chunks[i] = tokens.slice(i * numWordsInChunk).join(' ')
        }
    }
    return chunks
}

function LineChart({ timeSeriesData, annotations, title }) {
    const sample_key = Object.keys(timeSeriesData)[0];
    const chartAnnotations = [];
    // console.log(annotations);
    let j = 0;
    for (const [key, annotation] of Object.entries(annotations)) {
        // console.log(annotation, j);
        chartAnnotations.push({
            type: 'line',
            borderColor: color(j),
            borderWidth: 2,
            borderDash: [6, 6],
            borderDashOffset: 0,
            display: (ctx) => ctx.chart.isDatasetVisible(1),
            scaleID: 'x',
            value: annotation.date
        });
        chartAnnotations.push(
            {
                type: 'label',
                xValue: annotation.date,
                yValue: 30 + Math.floor(Math.random() * 60),
                backgroundColor: 'rgba(245,245,245)',
                content: chunkHeadline(annotation.headline, 4),
                font: {
                    size: 12
                }
            }
        );
        j++;
    };
    console.log(chartAnnotations)

    // const annotation = {
    //     type: 'line',
    //     borderColor: 'black',
    //     borderWidth: 1,
    //     borderDash: [6, 6],
    //     borderDashOffset: 0,
    //     display: (ctx) => ctx.chart.isDatasetVisible(1),
    //     label: {
    //         display: true,
    //         content: 'Now',
    //         position: 'start'
    //     },
    //     scaleID: 'x',
    //     value: '2022-08-05'
    // };
    const data = timeSeriesData[sample_key];
    console.log(data[0]);
    const totalDuration = 20000;
    const delayBetweenPoints = totalDuration / data.length;
    // const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    const datasets = [];
    let i = 0;
    for (const [key, value] of Object.entries(timeSeriesData)) {
        console.log(`Label ${key}`);
        datasets.push({
            label: key,
            borderWidth: 3,
            radius: 0,
            data: value,
            borderColor: color(i),
            backgroundColor: color(i),
            fill: true,
        })
        i++;
    }

    const chartRef = useRef();
    const chartData = {
        datasets: datasets
    };

    const chartOptions = {
        animation,
        responsive: true,
        interaction: {
            mode: 'nearest',
            axis: 'xy',
            intersect: false
        },
        plugins: {
            annotation: {
                common: {
                    drawTime: 'afterDatasetsDraw'
                },
                annotations: chartAnnotations
            },
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                type: 'time',
                grid: {
                    display: false
                },
                time: {
                    unit: 'month'
                },
            },
            y: {
                display: true,
                stacked: false,
                grid: {
                    display: true
                },
                title: {
                    display: true,
                    text: ["Mainstream Media Front Page", "Real Estate"],
                    color: 'black',
                    font: {
                        family: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
                        size: 20,
                        weight: 'bold',
                        lineHeight: 1.2,
                    },
                    padding: {
                        left: '20px'
                    },
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, ticks) {
                        if (value > 100) {
                            return ''
                        }
                        return value + '%';
                    }
                },
                min: 0,
                max: 100,
                suggestedMin: 0,
                suggestedMax: 100
            },
        },
        parsing: {
            xAxisKey: 'Date',
            yAxisKey: 'Front Page Attention Trailing Average'
        },

    };
    return (<div className={styles.grid}>
        <h2>{title}</h2>
        <Line
            ref={chartRef}
            data={chartData}
            options={chartOptions}
        />
    </div>)
}


export default function Home({ timeSeriesData, annotations }) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Mainstream Media Coverage of the top 5 topics of 2022 </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>

                <LineChart timeSeriesData={timeSeriesData} annotations={annotations} title='The Top 5 Biggest News Cycle Hits in 2022 So Far'></LineChart>
                <p className={styles.code}> Sources Tracked: BBC, CNN, Fox News, NBC News, New York Times, Reuters, Washington Examiner, Washington Post, Washington Times, Wall Street Journal</p>
                <h3>Subscribe to <a className={styles.link} href="https://topdown.substack.com">topdown.substack.com</a> to see this for each mainstream media outlet</h3>


            </main>

            <footer className={styles.footer}>
                <a
                    href="https://topdown.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by Top Down News
                </a>
            </footer>
        </div>
    )
}


export async function getStaticProps() {
    const timeSeriesData = getTimeSeriesData();
    const annotations = getAnnotations();
    return {
        props: {
            timeSeriesData,
            annotations,
        },
    };
}