import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Zap, MessageCircle } from 'lucide-react';
import './Services.css';

const servicesData = [
    {
        id: 'delivery',
        icon: <Truck size={48} />,
        badge: 'EXPRESS DELIVERY',
        title: 'Door-to-door delivery across Morocco',
        description: 'We partner with the best delivery companies to ensure your books arrive in record time (24 to 48 hours). Wherever you are in Morocco, we deliver right to your door.',
        highlights: ['Delivery in 24-48 hours', 'Anywhere in Morocco', 'Order tracking available'],
        color: '#4f46e5',
        image: '/assets/delivery.png'
    },
    {
        id: 'payment',
        icon: <ShieldCheck size={48} />,
        badge: 'TRUST & SECURITY',
        title: 'Pay only when you receive your books',
        description: 'No need to pay in advance. Pay cash to the delivery person when you receive your order. This way, you can be completely confident in the quality of your purchase.',
        highlights: ['Payment on Delivery (COD)', 'No credit card needed', 'Trusted service'],
        color: '#10b981',
        image: '/assets/trust.png'
    },
    {
        id: 'quality',
        icon: <Zap size={48} />,
        badge: 'PREMIUM QUALITY',
        title: 'Brand new, original books at the best price',
        description: 'Every book in our store is authentic and brand new. We carefully select our inventory to provide you with a unique and premium reading experience.',
        highlights: ['Original Editions', 'Premium paper quality', 'Excellent packaging'],
        color: '#f59e0b',
        image: '/assets/quality.png'
    },
    {
        id: 'support',
        icon: <MessageCircle size={48} />,
        badge: 'DIRECT SUPPORT',
        title: 'We are here on WhatsApp for you anytime',
        description: 'If you have any questions about a book or need help choosing, you can always chat with us on WhatsApp. Our team is ready to answer you immediately.',
        highlights: ['WhatsApp support till late', 'Personalized recommendations', 'Quick responses'],
        color: '#25d366',
        image: '/assets/support.png',
        action: {
            text: 'Contact Us on WhatsApp',
            url: 'https://wa.me/212767799012?text=Bonjour%20LuminaBooks%21%20J%27aimerais%20avoir%20plus%20d%27informations.%20%28Hello%20LuminaBooks%21%20I%20would%20like%20more%20information.%29'
        }
    }
];

const Services = () => {
    return (
        <div className="services-detailed">
            {servicesData.map((service, index) => (
                <section key={service.id} className={`service-detail-section ${index % 2 !== 0 ? 'reverse' : ''}`}>
                    <div className="container service-detail-container">
                        <motion.div
                            className="service-detail-content"
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="detail-badge" style={{ color: service.color, background: `${service.color}15` }}>
                                {service.badge}
                            </span>
                            <div className="detail-icon" style={{ color: service.color }}>
                                {service.icon}
                            </div>
                            <h2>{service.title}</h2>
                            <p className="detail-description">{service.description}</p>

                            <ul className="detail-highlights">
                                {service.highlights.map((h, i) => (
                                    <li key={i}>
                                        <div className="bullet" style={{ background: service.color }}></div>
                                        {h}
                                    </li>
                                ))}
                            </ul>

                            {service.action && (
                                <motion.a
                                    href={service.action.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="service-action-btn"
                                    style={{ '--btn-color': service.color }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {service.action.text}
                                </motion.a>
                            )}
                        </motion.div>

                        <motion.div
                            className="service-detail-visual"
                            initial={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? 50 : -50 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="image-wrapper-detailed">
                                <img src={service.image} alt={service.title} />
                                <div className="glow-effect" style={{ background: service.color }}></div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Services;
