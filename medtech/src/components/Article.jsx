import React from "react";
import { useParams } from 'react-router-dom';
import { article } from "../../articleData";


const Article = () => {
    const { type } = useParams();
    if (type == "melanoma"){
        return (
            <div className="article-container" dangerouslySetInnerHTML={{ __html: article.melanoma }}>
                
            </div>
        )
    }
    else if (type == "basal"){
        return (
            <div className="article-container" dangerouslySetInnerHTML={{ __html: article.basel}}>
                
            </div>
        )
    }
    else if (type == "actinic-keratosis") {
        return (
            <div className="article-container" dangerouslySetInnerHTML={{ __html: article.actinicKeratosis}}>
                
            </div>
        )
    }
    else {
        return (
            <div className="article-container">
                No Information
            </div>
        )
    }
}

export default Article