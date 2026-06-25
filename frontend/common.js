function openModal(type){

    let title = "";
    let text = "";

    switch(type){

        case "booking":
            title = "Booking Guide";
            text = "The Booking Guide serves as a comprehensive resource designed to assist users throughout the entire reservation process. It provides detailed instructions on how to create, modify, and manage bookings efficiently. Users can find step-by-step guidance, important requirements, and helpful tips to ensure a smooth and hassle-free booking experience. This section aims to simplify the reservation journey and help users make informed decisions with confidence.";
            break;

        case "panel":
            title = "My Panel";
            text = "My Panel is a personalized dashboard that allows users to conveniently access and manage their account information in one place. Through this section, users can review their booking history, update personal details, monitor upcoming reservations, and manage account preferences. It is designed to provide a seamless and organized experience, giving users complete control over their interactions with the platform.";
            break;

        case "story":
            title = "Our Story";
            text = "Our Story highlights the history, mission, and core values of our organization. It offers insight into how the company was established, the goals that drive our services, and our commitment to delivering exceptional customer experiences. This section reflects our dedication to growth, innovation, and excellence while fostering trust and transparency with our customers and partners.";
            break;

        case "updates":
            title = "Latest Updates";
            text = "The Latest Updates section provides timely information regarding new features, service enhancements, announcements, and important developments within the platform. Users can stay informed about the latest improvements, upcoming events, policy changes, and special promotions. By regularly checking this section, users can remain updated and take full advantage of the services and opportunities available.";
            break;

        case "agreement":
            title = "User Agreement";
            text = "The User Agreement outlines the terms and conditions governing the use of our platform and services. It defines the rights, responsibilities, and obligations of both the users and the organization, ensuring a fair and transparent relationship. This section is intended to help users understand the rules and expectations associated with accessing and using our services while promoting a safe and reliable environment for everyone.";
            break;

        case "protection":
            title = "Data Protection";
            text = "The Data Protection section explains how personal information is collected, stored, processed, and safeguarded. We are committed to maintaining the highest standards of privacy and security to protect user data from unauthorized access, misuse, or disclosure. This section demonstrates our dedication to responsible data management and compliance with applicable privacy regulations, ensuring users can trust us with their information.";
            break;

        case "rules":
            title = "Booking Rules";
            text = "The Booking Rules section contains the policies and guidelines that govern all reservations made through the platform. It covers important topics such as eligibility requirements, scheduling procedures, cancellations, modifications, refunds, and user responsibilities. These rules are established to ensure fairness, consistency, and efficiency in the booking process while providing a clear understanding of expectations for all users.";
            break;

        case "payment":
            title = "Payment Information";
            text = "The Payment Information section provides detailed guidance on available payment methods, billing procedures, transaction processing, and payment security measures. Users can learn about accepted payment options, verification requirements, and important financial policies related to their bookings. This section is designed to ensure transparency, convenience, and confidence throughout every stage of the payment process.";
            break;
    }

    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalText").innerText = text;
    document.getElementById("infoModal").style.display = "block";
}

function closeModal(){
    document.getElementById("infoModal").style.display = "none";
}
