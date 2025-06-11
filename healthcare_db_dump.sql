--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    action character varying NOT NULL,
    resource character varying NOT NULL,
    "resourceId" character varying NOT NULL,
    data jsonb NOT NULL,
    "userId" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    module character varying(50) NOT NULL,
    "entityId" character varying(100) NOT NULL,
    "ipAddress" character varying(50) NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: billing_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing_sessions (
    id integer NOT NULL,
    total numeric(10,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "patientId" integer NOT NULL,
    services jsonb,
    "invoiceId" integer,
    "clinicId" integer NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.billing_sessions OWNER TO postgres;

--
-- Name: billing_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.billing_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.billing_sessions_id_seq OWNER TO postgres;

--
-- Name: billing_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.billing_sessions_id_seq OWNED BY public.billing_sessions.id;


--
-- Name: clinics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinics (
    id integer NOT NULL,
    name character varying NOT NULL,
    address character varying NOT NULL,
    logo text,
    settings jsonb,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.clinics OWNER TO postgres;

--
-- Name: clinics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clinics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clinics_id_seq OWNER TO postgres;

--
-- Name: clinics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clinics_id_seq OWNED BY public.clinics.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    "basePrice" numeric(10,2) NOT NULL,
    "finalPrice" numeric(10,2) NOT NULL,
    discount numeric(10,2),
    reason text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "billingSessionId" integer,
    "patientId" integer
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: ohip_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ohip_codes (
    id integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "pricingRulesId" integer,
    code character varying NOT NULL,
    description character varying NOT NULL,
    "basePrice" integer NOT NULL,
    "maxPrice" integer
);


ALTER TABLE public.ohip_codes OWNER TO postgres;

--
-- Name: ohip_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ohip_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ohip_codes_id_seq OWNER TO postgres;

--
-- Name: ohip_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ohip_codes_id_seq OWNED BY public.ohip_codes.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    "clinicId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patients_id_seq OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: pricing_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pricing_rules (
    id integer NOT NULL,
    "clinicId" integer NOT NULL,
    "ohipCodeId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    percentage integer NOT NULL
);


ALTER TABLE public.pricing_rules OWNER TO postgres;

--
-- Name: pricing_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pricing_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pricing_rules_id_seq OWNER TO postgres;

--
-- Name: pricing_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pricing_rules_id_seq OWNED BY public.pricing_rules.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL,
    permissions text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: roles_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_users_users (
    "rolesId" integer NOT NULL,
    "usersId" integer NOT NULL
);


ALTER TABLE public.roles_users_users OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_roles_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_roles_roles (
    "usersId" integer NOT NULL,
    "rolesId" integer NOT NULL
);


ALTER TABLE public.users_roles_roles OWNER TO postgres;

--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: billing_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_sessions ALTER COLUMN id SET DEFAULT nextval('public.billing_sessions_id_seq'::regclass);


--
-- Name: clinics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics ALTER COLUMN id SET DEFAULT nextval('public.clinics_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: ohip_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ohip_codes ALTER COLUMN id SET DEFAULT nextval('public.ohip_codes_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: pricing_rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_rules ALTER COLUMN id SET DEFAULT nextval('public.pricing_rules_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, action, resource, "resourceId", data, "userId", "createdAt", "updatedAt", module, "entityId", "ipAddress") FROM stdin;
\.


--
-- Data for Name: billing_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billing_sessions (id, total, "createdAt", "updatedAt", "patientId", services, "invoiceId", "clinicId", description) FROM stdin;
\.


--
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinics (id, name, address, logo, settings, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, "basePrice", "finalPrice", discount, reason, "createdAt", "updatedAt", "billingSessionId", "patientId") FROM stdin;
\.


--
-- Data for Name: ohip_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ohip_codes (id, "isActive", "createdAt", "updatedAt", "pricingRulesId", code, description, "basePrice", "maxPrice") FROM stdin;
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, "firstName", "lastName", email, phone, "clinicId", "createdAt", "updatedAt") FROM stdin;
1	John	Doe	john@example.com	1234567890	1	2025-06-10 16:43:34.900966	2025-06-10 16:43:34.900966
2	John	Doe	test@example.com	1234567890	1	2025-06-10 19:55:31.89647	2025-06-10 19:55:31.89647
\.


--
-- Data for Name: pricing_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pricing_rules (id, "clinicId", "ohipCodeId", "createdAt", "updatedAt", percentage) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, permissions) FROM stdin;
1	admin	invoices.read,invoices.write,patients.read,patients.write,clinics.read,clinics.write,users.read,users.write,roles.read,roles.write,audit.log.read,audit.log.write
2	doctor	patients.read,patients.write,clinics.read
3	receptionist	invoices.read,invoices.write,patients.read,patients.write,clinics.read
\.


--
-- Data for Name: roles_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_users_users ("rolesId", "usersId") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt") FROM stdin;
1	test@example.com	$2b$10$ReHXlQxxKRAAmz5b0DyrUeCzZbvsi/wq.dDBtAEQWwTQd7tqJdsji	Test	User	t	2025-06-10 16:43:34.8104	2025-06-10 16:43:34.8104
\.


--
-- Data for Name: users_roles_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_roles_roles ("usersId", "rolesId") FROM stdin;
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, true);


--
-- Name: billing_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.billing_sessions_id_seq', 1, false);


--
-- Name: clinics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clinics_id_seq', 1, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: ohip_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ohip_codes_id_seq', 1, false);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 2, true);


--
-- Name: pricing_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pricing_rules_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: clinics PK_5513b659e4d12b01a8ab3956abc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT "PK_5513b659e4d12b01a8ab3956abc" PRIMARY KEY (id);


--
-- Name: invoices PK_668cef7c22a427fd822cc1be3ce; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY (id);


--
-- Name: users_roles_roles PK_6c1a055682c229f5a865f2080c1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "PK_6c1a055682c229f5a865f2080c1" PRIMARY KEY ("usersId", "rolesId");


--
-- Name: ohip_codes PK_7987467dd66d681096ec7981599; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ohip_codes
    ADD CONSTRAINT "PK_7987467dd66d681096ec7981599" PRIMARY KEY (id);


--
-- Name: billing_sessions PK_79c8d678d64e843c108f307d246; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_sessions
    ADD CONSTRAINT "PK_79c8d678d64e843c108f307d246" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: patients PK_a7f0b9fcbb3469d5ec0b0aceaa7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: roles_users_users PK_d9b9cca39b8cc7e99072274dafa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_users_users
    ADD CONSTRAINT "PK_d9b9cca39b8cc7e99072274dafa" PRIMARY KEY ("rolesId", "usersId");


--
-- Name: pricing_rules PK_fda27bb8db4630894decda61ff6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT "PK_fda27bb8db4630894decda61ff6" PRIMARY KEY (id);


--
-- Name: ohip_codes UQ_5e2464d45e7d6dd7b5a63082f23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ohip_codes
    ADD CONSTRAINT "UQ_5e2464d45e7d6dd7b5a63082f23" UNIQUE (code);


--
-- Name: roles UQ_648e3f5447f725579d7d4ffdfb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name);


--
-- Name: patients UQ_64e2031265399f5690b0beba6a5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "UQ_64e2031265399f5690b0beba6a5" UNIQUE (email);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: IDX_391282056f6da8665b38480a13; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_391282056f6da8665b38480a13" ON public.roles_users_users USING btree ("usersId");


--
-- Name: IDX_6baa1fce24dde516186c4f0269; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6baa1fce24dde516186c4f0269" ON public.roles_users_users USING btree ("rolesId");


--
-- Name: IDX_b2f0366aa9349789527e0c36d9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b2f0366aa9349789527e0c36d9" ON public.users_roles_roles USING btree ("rolesId");


--
-- Name: IDX_df951a64f09865171d2d7a502b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_df951a64f09865171d2d7a502b" ON public.users_roles_roles USING btree ("usersId");


--
-- Name: roles_users_users FK_391282056f6da8665b38480a131; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_users_users
    ADD CONSTRAINT "FK_391282056f6da8665b38480a131" FOREIGN KEY ("usersId") REFERENCES public.users(id);


--
-- Name: billing_sessions FK_3987ec226bcd70b8c92cce15268; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_sessions
    ADD CONSTRAINT "FK_3987ec226bcd70b8c92cce15268" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id);


--
-- Name: pricing_rules FK_45fadfbf38e780f0adf3e6c6e13; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT "FK_45fadfbf38e780f0adf3e6c6e13" FOREIGN KEY ("clinicId") REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- Name: roles_users_users FK_6baa1fce24dde516186c4f0269a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_users_users
    ADD CONSTRAINT "FK_6baa1fce24dde516186c4f0269a" FOREIGN KEY ("rolesId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoices FK_7f1f96ee217edce59c605cc9380; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_7f1f96ee217edce59c605cc9380" FOREIGN KEY ("patientId") REFERENCES public.patients(id);


--
-- Name: invoices FK_84aeaf78e33186b274f86345861; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_84aeaf78e33186b274f86345861" FOREIGN KEY ("billingSessionId") REFERENCES public.billing_sessions(id);


--
-- Name: billing_sessions FK_a10aa6f5e629c07b70ce1dcaba1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_sessions
    ADD CONSTRAINT "FK_a10aa6f5e629c07b70ce1dcaba1" FOREIGN KEY ("patientId") REFERENCES public.patients(id);


--
-- Name: users_roles_roles FK_b2f0366aa9349789527e0c36d97; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "FK_b2f0366aa9349789527e0c36d97" FOREIGN KEY ("rolesId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_roles_roles FK_df951a64f09865171d2d7a502b1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ohip_codes FK_ea1c6bd2e341ad97186bba2fc4c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ohip_codes
    ADD CONSTRAINT "FK_ea1c6bd2e341ad97186bba2fc4c" FOREIGN KEY ("pricingRulesId") REFERENCES public.pricing_rules(id);


--
-- Name: pricing_rules FK_f8fedf37ab8dd03d9db5c095e0b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT "FK_f8fedf37ab8dd03d9db5c095e0b" FOREIGN KEY ("ohipCodeId") REFERENCES public.ohip_codes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

