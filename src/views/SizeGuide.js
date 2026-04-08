import { useState } from "react";
import { X } from "lucide-react";

const COFFEE = "#6F4E37";

export default function SizeGuideModal({ isOpen, onClose }) {
    const [unit, setUnit] = useState("in");
    const [category, setCategory] = useState("shirt");

    if (!isOpen) return null;

    const sizeData = {
        shirt: [
            { size: 36, chest: 37.5, shoulder: 16, length: 27 },
            { size: 38, chest: 39.5, shoulder: 17, length: 28 },
            { size: 40, chest: 41.5, shoulder: 18, length: 29 },
            { size: 42, chest: 45, shoulder: 19, length: 30 },
        ],
        pant: [
            { size: 28, waist: 28, hip: 36, length: 38 },
            { size: 30, waist: 30, hip: 38, length: 39 },
            { size: 32, waist: 32, hip: 40, length: 40 },
            { size: 34, waist: 34, hip: 42, length: 41 },
        ],
        tshirt: [
            { size: "S", chest: 38, shoulder: 17, length: 26 },
            { size: "M", chest: 40, shoulder: 18, length: 27 },
            { size: "L", chest: 42, shoulder: 19, length: 28 },
        ],
        jacket: [
            { size: "M", chest: 40, shoulder: 18, length: 27 },
            { size: "L", chest: 42, shoulder: 19, length: 28 },
            { size: "XL", chest: 44, shoulder: 20, length: 29 },
        ],
    };

    const guideImages = {
        shirt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3C4f5pm-iFILs08wLeeH3ywcFpXJRxu0eQQ&s",
        pant: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXf-AxykrufW4eidzPFE3MhjV6Qxj_ETMJw5OiDgbLNbmWXW_o1aCfHZsTAZ_A9Gh4L1xnxqw3Xrx0f9c_tC333MDjkRjRbkB8bSdBFgaK77Vgf9ntBeqvK9NRtvq0CYfDadtoLF?key=3WAths9qi0vWhJa_3DXAdz2K",
        tshirt: "https://community.printrove.com/galleryDocuments/edbsnb2b180406f75dc2dbaa50af08f359e488afc8da7fb01cbe420380e0ef0a0c297206183cea8abb0a906ff42ffa435f04e?inline=true",
        jacket: "https://cdn.shopify.com/s/files/1/0488/9899/8437/files/MeasurementGuide_734a3f6f-88cb-4e91-84b0-4641c0241248_480x480.png?v=1601926217",
    };

    const measurementDetails = {
        shirt: [
            {
                title: "Across Shoulder",
                desc: "Measure horizontally from the tip of one shoulder to the other.",
            },
            {
                title: "Chest",
                desc: "Measure across the chest below the armpits.",
            },
            {
                title: "Waist",
                desc: "Measure horizontally around the waist.",
            },
            {
                title: "Length",
                desc: "Measure vertically from shoulder to bottom hem.",
            },
            {
                title: "Sleeve Length",
                desc: "Measure from shoulder tip to sleeve end.",
            },
        ],

        pant: [
            {
                title: "Waist",
                desc: "Measure around your natural waistline.",
            },
            {
                title: "Hip",
                desc: "Measure around the fullest part of hips.",
            },
            {
                title: "Length",
                desc: "Measure from waist to ankle.",
            },
            {
                title: "Inseam",
                desc: "Measure from crotch to ankle inside leg.",
            },
        ],

        tshirt: [
            {
                title: "Chest",
                desc: "Measure across chest under arms.",
            },
            {
                title: "Shoulder",
                desc: "Measure shoulder tip to tip.",
            },
            {
                title: "Length",
                desc: "Measure from shoulder to bottom.",
            },
        ],

        jacket: [
            {
                title: "Chest",
                desc: "Measure across chest area.",
            },
            {
                title: "Shoulder",
                desc: "Measure from shoulder to shoulder.",
            },
            {
                title: "Sleeve",
                desc: "Measure from shoulder to wrist.",
            },
            {
                title: "Length",
                desc: "Measure from collar to bottom.",
            },
        ],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white text-black w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl z-10">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Size Guide</h2>
                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">

                    {/* CATEGORY TABS */}
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                        {["shirt", "pant", "tshirt", "jacket"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-1 rounded-full text-sm capitalize ${category === cat
                                    ? "text-white"
                                    : "bg-gray-200"
                                    }`}
                                style={
                                    category === cat
                                        ? { backgroundColor: COFFEE }
                                        : {}
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* UNIT TOGGLE */}
                    <div className="flex justify-end mb-3">
                        <div className="flex border rounded-full overflow-hidden text-xs">
                            <button
                                onClick={() => setUnit("in")}
                                className={`px-3 py-1 ${unit === "in" ? "text-white" : ""
                                    }`}
                                style={
                                    unit === "in"
                                        ? { backgroundColor: COFFEE }
                                        : {}
                                }
                            >
                                in
                            </button>
                            <button
                                onClick={() => setUnit("cm")}
                                className={`px-3 py-1 ${unit === "cm" ? "text-white" : ""
                                    }`}
                                style={
                                    unit === "cm"
                                        ? { backgroundColor: COFFEE }
                                        : {}
                                }
                            >
                                cm
                            </button>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-gray-100 text-xs uppercase">
                                <tr>
                                    <th className="py-2">Size</th>

                                    {category === "pant" ? (
                                        <>
                                            <th>Waist</th>
                                            <th>Hip</th>
                                            <th>Length</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Chest</th>
                                            <th>Shoulder</th>
                                            <th>Length</th>
                                        </>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {sizeData[category].map((row, i) => (
                                    <tr key={i} className="border-t even:bg-gray-50">
                                        <td className="py-2 font-medium">{row.size}</td>

                                        {category === "pant" ? (
                                            <>
                                                <td>{row.waist}</td>
                                                <td>{row.hip}</td>
                                                <td>{row.length}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{row.chest}</td>
                                                <td>{row.shoulder}</td>
                                                <td>{row.length}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* HOW TO MEASURE */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-3">
                            How to Measure
                        </h3>

                        <div className="border rounded-lg p-3 mb-4 bg-white">
                            <img
                                src={guideImages[category]}
                                alt="measurement guide"
                                className="w-full object-contain"
                            />
                        </div>

                        <ul className="text-sm space-y-3 text-gray-700">
                            {measurementDetails[category].map((item, i) => (
                                <li key={i}>
                                    <strong>{item.title}:</strong> {item.desc}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}