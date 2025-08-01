// import QRCodeManager from "@/components/Dashboard/QRCodeManager";
import QRCodeManager from "../../../components/dashboard/QRCodeManager"

export const metadata = {
    title: "QR Code Manager - Business Dashboard",
    description: "Generate and manage QR codes for your business page"
};

const QRCodePage = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <QRCodeManager />
        </div>
    );
};

export default QRCodePage;
