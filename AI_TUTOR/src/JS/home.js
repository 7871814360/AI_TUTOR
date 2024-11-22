import '../CSS/home.css';
import '../CSS/upload.css';
import '../CSS/book_box.css';
import UploadForm from './pdf_upload.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PDF from './pdf_page.js';

const App = ({ email }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [openPDFPage, setOpenPDFPage] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4001/files', { email });
            setFiles(response.data.files);
        } catch (error) {
            console.error("Error fetching files:", error);
            alert("Failed to fetch files.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email) {
            fetchFiles();
        }
    }, [email]);

    const handleClick = (e) => {
        e.preventDefault();
        const url = `http://localhost:4001/uploads/${e.target.value}.pdf`;
        setPdfUrl(url);
        setOpenPDFPage(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        fetchFiles(); // Refresh files when closing the modal
    };

    return !openPDFPage ? (
        <div>
            <h1>AI TUTOR FOR CHILD</h1>
            <h5>Welcome! {email}</h5>
            <button onClick={() => setIsModalOpen(true)}>UPLOAD PDF</button>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <h1>Upload a PDF</h1>
                        <UploadForm email={email} />
                    </div>
                </div>
            )}
            {isModalOpen && <div className="modal-background" onClick={closeModal} />}
            
            <div>
                <h2>Your Uploaded Files:</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : files.length > 0 ? (
                    <ul>
                        {files.map(file => (
                            <div key={file.file_id} className='book_box'>
                                <button className='book_btn' value={file.file_id} onClick={handleClick}>Open</button>
                                <p>{file.file_name}</p>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No files uploaded yet.</p>
                )}
            </div>
        </div>
    ) : (
        <PDF url={pdfUrl} />
    );
};
export default App;