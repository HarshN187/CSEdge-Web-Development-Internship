/* script.js */

function generateResume() {
  const formData = new FormData(document.getElementById("resumeForm"));
  const resumeData = {};

  formData.forEach((value, key) => {
    resumeData[key] = value;
  });

  const template = document.getElementById("template").value;
  fetch(`templates/${template}.html`)
    .then((response) => response.text())
    .then((templateHtml) => {
      const renderedHtml = templateHtml.replace(
        /\{\{(\w+)\}\}/g,
        (match, key) => resumeData[key] || ""
      );
      const previewFrame = document.getElementById("preview");
      const previewDoc =
        previewFrame.contentDocument || previewFrame.contentWindow.document;
      previewDoc.open();
      previewDoc.write(renderedHtml);
      previewDoc.close();
    })
    .catch((error) => console.error("Error loading template:", error));
}

document.getElementById("resumeForm").addEventListener("input", generateResume);

function exportToPDF() {
  const previewFrame = document.getElementById("preview");
  const previewDoc =
    previewFrame.contentDocument || previewFrame.contentWindow.document;

  html2canvas(previewDoc.body).then((canvas) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "pt", "a4");
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 595.28;
    const pageHeight = 841.89;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save("resume.pdf");
  });
}

document
  .getElementById("exportPdfButton")
  .addEventListener("click", exportToPDF);
