import React, { useRef } from 'react'
import { fabric } from 'fabric'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'


const funButtons = React.createContext()

export const useButtons = () => {
    return React.useContext(funButtons)
}







export const CanvasProvider = ({ children }) => {
    const [numPages, setNumPages] = React.useState(null);
    const [currPage, setCurrPage] = React.useState(1);
    const [selectedFile, setFile] = React.useState(null);
    const [color, setColor] = React.useState("#000");
    const [borderColor, setBorderColor] = React.useState("#f4a261");
    const [strokeWidth, setStrokeWidth] = React.useState(1);
    const [canvas, setCanvas] = React.useState('');
    const [isExporting, setExporting] = React.useState(false);
    const [hideCanvas, setHiddenCanvas] = React.useState(false);

    const exportPage = useRef(null);
    const [exportPages, setExportPages] = React.useState([]);
    // canvas edits
    const [edits, setEdits] = React.useState({});
    // uploaded image

    React.useEffect(() => {
        if (document.getElementById("canvasWrapper"))
            document.getElementById("canvasWrapper").style.visibility = document.getElementById("canvasWrapper").style.visibility == "hidden" ? "visible" : "hidden";
    }, [hideCanvas])

    React.useEffect(() => {
        if (canvas != '') {
            var activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("fill", color)
                canvas.renderAll()
            }
        }
    }, [color])

    React.useEffect(() => {
        if (canvas.isDrawingMode)
            canvas.freeDrawingBrush.color = borderColor;
        if (canvas != '') {
            var activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("stroke", borderColor)
                canvas.renderAll()
            }
        }
    }, [borderColor])

    React.useEffect(() => {
        if (canvas.isDrawingMode)
            canvas.freeDrawingBrush.width = strokeWidth;
        if (canvas != '') {
            var activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("strokeWidth", strokeWidth)
                canvas.renderAll()
            }
        }
    }, [strokeWidth])

    const downloadPage = () => {
        setExporting(true);
        const doc = document.querySelector('#singlePageExport');
        html2canvas(doc)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save("marked_submission.pdf");
                setExporting(false);
            });
    }

    const addImage = (e, canvi) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (f) {
            var data = f.target.result;
            fabric.Image.fromURL(data, function (img) {
                img.scaleToWidth(300);
                canvi.add(img).renderAll();
                var dataURL = canvi.toDataURL({ format: 'png', quality: 0.8 });
            });
        }
        reader.readAsDataURL(file);
        canvi.isDrawingMode = false
    }

    const addNote = (canvi) => {
        fabric.Image.fromURL(`./note/note${(Math.floor(Math.random() * 10) % 4) + 1}.png`, function (img) {
            img.scaleToWidth(100);
            canvi.add(img).renderAll();
            var dataURL = canvi.toDataURL({ format: 'png', quality: 0.8 });
        });
        canvi.isDrawingMode = false
    }

    const deleteBtn = () => {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    }

    // add a rectangle
    const addRect = canvi => {
        const rect = new fabric.Rect({
            height: 180,
            width: 200,
            fill: color,
            stroke: borderColor,
            strokeWidth: strokeWidth,
            cornerStyle: 'circle',
            editable: true
        });
        canvi.add(rect);
        canvi.renderAll();
        canvi.isDrawingMode = false
    }

    const addCircle = canvi => {
        const rect = new fabric.Circle({
            radius: 100,
            fill: color,
            cornerStyle: 'circle',
            editable: true,
            stroke: borderColor,
            strokeWidth: 2,
        });
        canvi.add(rect);
        canvi.renderAll();
        canvi.isDrawingMode = false
    }

    const addHighlight = canvi => {
        const rect = new fabric.Rect({
            height: 20,
            width: 400,
            fill: color + '99',
            cornerStyle: 'circle',
            editable: true
        });
        canvi.add(rect);
        canvi.renderAll();
        canvi.isDrawingMode = false
    }

    const addText = canvi => {
        const text = new fabric.Textbox("Type Here ...", {
            editable: true,
        });
        text.set({ fill: color, fontFamily: 'Times New Roman'})
        canvi.add(text);
        canvi.renderAll();
        canvi.isDrawingMode = false
    }

    const toggleDraw = canvi => {
        canvi.isDrawingMode = !canvi.isDrawingMode;
        var brush = canvas.freeDrawingBrush;
        brush.color = borderColor;
        brush.strokeWidth = strokeWidth;
    }

    const exportPdf = () => {
        setExportPages((prev) => ([...prev, exportPage.current]));
        console.log(exportPages)
    }

    return (
        <funButtons.Provider value={{ canvas, setCanvas, addRect, addCircle, addText, addImage, numPages, setNumPages, currPage, setCurrPage, selectedFile, setFile, addHighlight, toggleDraw, color, setColor, edits, setEdits, addNote, deleteBtn, exportPage, exportPdf, downloadPage, isExporting, borderColor, setBorderColor, strokeWidth, setStrokeWidth, hideCanvas, setHiddenCanvas }}>
            {children}
        </funButtons.Provider>
    )
}