import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PDFGeneratorProps {
  contentId: string;
  filename: string;
  label?: string;
  isCard?: boolean;
}

const PDFGenerator = ({
  contentId,
  filename,
  label = "Download PDF",
  isCard = false
}: PDFGeneratorProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const generatePDF = async () => {
    const element = document.getElementById(contentId);
    if (!element) return;

    try {
      // Disable the button during generation
      if (buttonRef.current) {
        buttonRef.current.disabled = true;
      }
      
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      if (isCard) {
        // Credit card dimensions (3.37in x 2.125in)
        // Convert to mm (1 inch = 25.4 mm)
        const cardWidth = 85.6; // mm (3.37 inches)
        const cardHeight = 54; // mm (2.125 inches)
        
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [cardWidth, cardHeight]
        });
        
        pdf.addImage(imgData, "PNG", 0, 0, cardWidth, cardHeight);
        pdf.save(`${filename}.pdf`);
      } else {
        // Regular PDF
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
        });
        
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`${filename}.pdf`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Re-enable the button
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  if (typeof label === "string") {
    return (
      <Button 
        ref={buttonRef}
        onClick={generatePDF} 
        className="bg-healthcare-primary hover:bg-healthcare-secondary text-white"
      >
        <Download className="mr-2 h-4 w-4" />
        {label}
      </Button>
    );
  }

  return (
    <div onClick={generatePDF} className="cursor-pointer">
      {label}
    </div>
  );
};

export default PDFGenerator;
