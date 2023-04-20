-- Supprimer les données de toutes les tables
TRUNCATE "Location" CASCADE;
TRUNCATE "HairSalon" CASCADE;
TRUNCATE "Stylist" CASCADE;
truncate "Appointment" cascade;
truncate "Review" cascade;
truncate "Service" cascade;
truncate "Customer" cascade;

-- Réinitialiser les séquences pour chaque modèle
ALTER SEQUENCE "Location_id_seq" RESTART WITH 1;
ALTER SEQUENCE "HairSalon_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Stylist_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Appointment_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Review_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Service_id_seq" RESTART WITH 1;
alter sequence "Customer_id_seq" restart with 1 ;
