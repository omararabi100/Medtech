import React from "react";
import { useParams } from 'react-router-dom';

const Article = () => {
    const { type } = useParams();
    if (type == "melanoma"){
        return (
            <div className="article-container">
                <h1><span>Melanoma</span></h1>
                <img src="https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2013/11/15/17/38/ds00190_-ds00439_im01723_r7_skincthu_jpg.jpg" alt="melanoma" />
                <p>
                Melanoma is a kind of skin cancer that starts in the melanocytes. Melanocytes are cells that make the pigment that gives skin its color. The pigment is called melanin. <br /> <br />

                Melanoma typically starts on skin that's often exposed to the sun. This includes the skin on the arms, back, face and legs. Melanoma also can form in the eyes. Rarely, it can happen inside the body, such as in the nose or throat. <br /> <br />

                The exact cause of all melanomas isn't clear. Most melanomas are caused by exposure to ultraviolet light. Ultraviolet light, also called UV light, comes from sunlight or tanning lamps and beds. Limiting exposure to UV light can help reduce the risk of melanoma. <br /> <br />

                The risk of melanoma seems to be increasing in people under 40, especially women. Knowing the symptoms of skin cancer can help ensure that cancerous changes are detected and treated before the cancer has spread. Melanoma can be treated successfully if it is found early.
                </p>
                <h2>Symptoms</h2>
                <p>The first melanoma signs and symptoms often are:</p>
                <ul>
                    <li>A change in an existing mole.</li>
                    <li>The development of a new pigmented or unusual-looking growth on the skin.</li>
                </ul>
                <p>
                <br />
                Melanoma doesn't always begin as a mole. It also can happen on otherwise healthy skin. <br /> <br />

                Melanomas symptoms can happen anywhere on the body. Melanomas most often develop in areas that have had exposure to the sun. This includes the arms, back, face and legs. <br /> <br />

                Melanomas also can happen in areas that aren't as exposed to the sun. This includes the soles of the feet, palms of the hands and fingernail beds. Melanoma also can happen inside the body. These hidden melanomas are more common in people with brown or Black skin.
                </p>
                <h2>Treatment</h2>
                <p>Melanoma treatment often starts with surgery to remove the cancer. Other treatments may include radiation therapy and treatment with medicine. Treatment for melanoma depends on several factors. These factors include the stage of your cancer, your overall health and your own preferences.</p>
                <h3>Surgery</h3>
                <p>
                Treatment for melanoma usually includes surgery to remove the melanoma. A very thin melanoma may be removed entirely during the biopsy and require no further treatment. Otherwise, your surgeon will remove the cancer as well as some of the healthy tissue around it. <br /> <br />

                For people with melanomas that are small and thin, surgery might be the only treatment needed. If the melanoma has grown deeper into the skin, there might be a risk that the cancer has spread. So other treatments are often used to make sure all the cancer cells are killed. <br /> <br />

                If the melanoma has grown deeper into the skin or if it may have spread to the nearby lymph nodes, surgery might be used to remove the lymph nodes.
                </p>
                <h3>Radiation Therapy</h3>
                <p>
                Radiation therapy treats cancer with powerful energy beams. The energy can come from X-rays, protons or other sources. During radiation therapy, you lie on a table while a machine moves around you. The machine directs radiation to precise points on your body. <br /> <br />

                Radiation therapy may be directed to the lymph nodes if the melanoma has spread there. Radiation therapy also can be used to treat melanomas that can't be removed completely with surgery. For melanoma that spreads to other areas of the body, radiation therapy can help relieve symptoms.
                </p>
                <h3>Immunotherapy</h3>
                <p>
                Immunotherapy for cancer is a treatment with medicine that helps the body's immune system to kill cancer cells. The immune system fights off diseases by attacking germs and other cells that shouldn't be in the body. Cancer cells survive by hiding from the immune system. Immunotherapy helps the immune system cells find and kill the cancer cells. <br /> <br />

                For melanoma, immunotherapy may be used after surgery for cancer that has spread to the lymph nodes or to other areas of the body. When melanoma can't be removed completely with surgery, immunotherapy treatments might be injected directly into the melanoma.
                </p>
                <h3>Targeted Therapy</h3>
                <p>
                Targeted therapy for cancer is a treatment that uses medicines that attack specific chemicals in the cancer cells. By blocking these chemicals, targeted treatments can cause cancer cells to die. <br /> <br />

                For melanoma, targeted therapy might be recommended if the cancer has spread to your lymph nodes or to other areas of your body. Cells from your melanoma may be tested to see if targeted therapy is likely to be effective against your cancer.
                </p>
                <h3>Chemotherapy</h3>
                <p>Chemotherapy treats cancer with strong medicines. Many chemotherapy medicines exist. Most are given through a vein. Some come in pill form. <br /> <br />

                Chemotherapy might be an option to help control melanoma that doesn't respond to other treatments. It might be used when immunotherapy or targeted therapy aren't helping. <br /> <br />

                Sometimes chemotherapy can be given in a vein in your arm or leg in a procedure called isolated limb perfusion. During this procedure, blood in your arm or leg isn't allowed to travel to other areas of your body for a short time. This helps keep the chemotherapy medicines near the melanoma and doesn't affect other parts of your body.</p>
            </div>
        )
    }
    else if (type == "basal"){
        return (
            <div className="article-container">
                <h1><span>Basal Cell Carcinoma</span></h1>
                <img src="https://assets.mayoclinic.org/content/dam/media/global/images/2023/02/09/basal-cell-carcinoma-on-brown-skin.jpg" alt="basal cell" />
                <p>Basal cell carcinoma is a type of skin cancer. Basal cell carcinoma begins in the basal cells — a type of cell within the skin that produces new skin cells as old ones die off. <br /> <br />

                Basal cell carcinoma often appears as a slightly transparent bump on the skin, though it can take other forms. Basal cell carcinoma occurs most often on areas of the skin that are exposed to the sun, such as your head and neck. <br /> <br />

                Most basal cell carcinomas are thought to be caused by long-term exposure to ultraviolet (UV) radiation from sunlight. Avoiding the sun and using sunscreen may help protect against basal cell carcinoma.</p>
            </div>
        )
    }
    else {
        return (
            <div className="article container">
                No Information
            </div>
        )
    }
}

export default Article