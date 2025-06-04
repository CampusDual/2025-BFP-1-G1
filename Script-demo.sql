INSERT INTO roles (role_name, role_description) VALUES 
('role_admin', 'role admin'),
('role_user', 'role user');

insert into user_roles (user_id, role_id) values (1,1);

