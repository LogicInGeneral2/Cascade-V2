import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDropzone } from 'react-dropzone';
import { fabric } from 'fabric';
import { useButtons } from './canvas';
import SideBar from './sidebar';
import { MdClose } from 'react-icons/md';
import { Icon } from './icon';
import Loader from './loader';
import { Box, Button, Typography, Container } from '@mui/material';

export default function FileUpload() {
    const contextValues = useButtons();
    const [docIsLoading, setDocIsLoading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: files => {
            setDocIsLoading(true);
            contextValues.setFile(files[0]);
        }
    });

    function onDocumentLoadSuccess({ numPages }) {
        contextValues.setEdits({});
        contextValues.setNumPages(numPages);
        contextValues.setCurrPage(1);
        contextValues.setCanvas(initCanvas());
        setTimeout(() => setDocIsLoading(false), 2000);
    }

    function changePage(offset) {
        const page = contextValues.currPage;
        contextValues.edits[page] = contextValues.canvas.toObject();
        contextValues.setEdits(contextValues.edits);
        contextValues.setCurrPage(page + offset);
        contextValues.canvas.clear();
        if (contextValues.edits[page + offset]) {
            contextValues.canvas.loadFromJSON(contextValues.edits[page + offset]);
        }
        contextValues.canvas.renderAll();
    }

    // Initialize Fabric.js canvas
    const initCanvas = () => {
        return new fabric.Canvas('canvas', {
            isDrawingMode: false,
            height: 842,
            width: 595,
            backgroundColor: 'rgba(0,0,0,0)'
        });
    };

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
            "pdfjs-dist/build/pdf.worker.min.mjs",
            import.meta.url
        ).toString();
    }, []);

    return (
        <Box sx={{
            minHeight: '100vh',
            ...(contextValues.theme && {
                color: 'white',
                backgroundColor: 'rgb(20,20,20)'
            })
        }}>
            {contextValues.selectedFile && <SideBar />}
            {contextValues.selectedFile ? (
                <Box sx={{
                    width: '100%',
                    py: 8,
                    ...(contextValues.theme ? {
                        color: 'white',
                        backgroundColor: 'rgb(20,20,20)'
                    } : {
                        color: 'black',
                        backgroundColor: 'white'
                    })
                }}>
                    <Box sx={{
                        p: 2,
                        zIndex: 1200,
                        backgroundColor: 'red',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderRadius: 1,
                        color: 'white',
                        position: 'fixed',
                        top: 5,
                        right: 5,
                        cursor: 'pointer'
                    }} onClick={() => contextValues.setFile(null)}>
                        <MdClose sx={{ fontSize: '24px' }} />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...(contextValues.theme ? {
                            color: 'white',
                            backgroundColor: 'rgb(20,20,20)'
                        } : {
                            color: 'black',
                            backgroundColor: 'white'
                        })
                    }}>
                        <Box id="singlePageExport" sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            ...(contextValues.theme ? {
                                color: 'white',
                                backgroundColor: 'rgb(20,20,20)'
                            } : {
                                color: 'black',
                                backgroundColor: 'white'
                            })
                        }}>
                            {docIsLoading && (
                                <>
                                    <Box sx={{
                                        position: 'fixed',
                                        width: '100%',
                                        height: '100%',
                                        top: 0,
                                        backgroundColor: 'rgba(50,50,50,0.2)',
                                        zIndex: 1001,
                                        backdropFilter: 'blur(5px)'
                                    }} />
                                    <Box sx={{
                                        position: 'fixed',
                                        zIndex: 1100,
                                        display: 'flex',
                                        width: '100%',
                                        height: '100%',
                                        top: 0,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Loader color="#606060" size={120} strokeWidth="5" />
                                    </Box>
                                </>
                            )}
                            <Document
                                file={contextValues.selectedFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="flex justify-center"
                                id="doc"
                            >
                                <Box sx={{
                                    position: 'absolute',
                                    zIndex: 9,
                                    p: 4,
                                    visibility: 'visible'
                                }} id="canvasWrapper">
                                    <canvas id="canvas" />
                                </Box>
                                <Box sx={{
                                    p: 4,
                                    ...(contextValues.isExporting ? {} : contextValues.theme ? {
                                        backgroundColor: 'rgb(25,25,25)',
                                        boxShadow: '0px 0px 16px rgb(0,0,0)',
                                        border: 'none'
                                    } : {
                                        boxShadow: '0px 0px 8px rgba(0,0,0,0.1)',
                                        border: '1px solid #ccc'
                                    })
                                }}>
                                    <Page pageNumber={contextValues.currPage} id="docPage" width={595} height={842} />
                                </Box>
                            </Document>
                        </Box>
                    </Box>
                    <Box sx={{
                        position: 'fixed',
                        bottom: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        gap: 3,
                        zIndex: 50
                    }}>
                        {contextValues.currPage > 1 && (
                            <Button variant="contained" color="primary" onClick={() => changePage(-1)}>
                                {'<'}
                            </Button>
                        )}
                        <Box sx={{
                            px: 4,
                            py: 2,
                            backgroundColor: 'gray',
                            borderRadius: 1,
                            color: 'white'
                        }}>
                            Page {contextValues.currPage} of {contextValues.numPages}
                        </Box>
                        {contextValues.currPage < contextValues.numPages && (
                            <Button variant="contained" color="primary" onClick={() => changePage(1)}>
                                {'>'}
                            </Button>
                        )}
                    </Box>
                </Box>
            ) : (
                <Container sx={{
                    minHeight: '100vh',
                    py: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} {...getRootProps()}>
                    <Box sx={{
                        display: 'flex',
                        width: '40vw',
                        height: '40vh',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 1,
                        border: '2px dashed #ccc',
                        p: 6
                    }}>
                        <Box sx={{
                            textAlign: 'center'
                        }}>
                            <Icon />
                            <Typography variant="body1" sx={{
                                display: 'flex',
                                ...(contextValues.theme ? {
                                    color: 'gray.400'
                                } : {
                                    color: 'gray.600'
                                })
                            }}>
                                <label
                                    htmlFor="file-upload"
                                    sx={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        color: 'indigo.500',
                                        '&:hover': {
                                            color: 'indigo.700'
                                        }
                                    }}
                                >
                                    Upload a file
                                    <input type="file" id="file-upload" accept="application/pdf" {...getInputProps()} style={{ display: 'none' }} />
                                </label>
                                <Typography component="span" sx={{ pl: 1 }}>or drag and drop</Typography>
                            </Typography>
                            <Typography variant="body2">PDF</Typography>
                        </Box>
                    </Box>
                </Container>
            )}
        </Box>
    );
}
