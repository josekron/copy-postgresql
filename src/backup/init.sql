--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

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

--
-- Name: random_words(text[]); Type: FUNCTION; Schema: public; Owner: joseantonioherrera
--

CREATE FUNCTION public.random_words(choices text[]) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
  RETURN (choices)[floor(random()*array_length(choices, 1))+1];
END;
$$;


ALTER FUNCTION public.random_words(choices text[]) OWNER TO joseantonioherrera;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_roles; Type: TABLE; Schema: public; Owner: joseantonioherrera
--

CREATE TABLE public.account_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    grant_date timestamp without time zone
);


ALTER TABLE public.account_roles OWNER TO joseantonioherrera;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: joseantonioherrera
--

CREATE TABLE public.accounts (
    user_id integer NOT NULL,
    firstname character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    created_on timestamp without time zone NOT NULL,
    last_login timestamp without time zone
);


ALTER TABLE public.accounts OWNER TO joseantonioherrera;

--
-- Name: accounts_user_id_seq; Type: SEQUENCE; Schema: public; Owner: joseantonioherrera
--

CREATE SEQUENCE public.accounts_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_user_id_seq OWNER TO joseantonioherrera;

--
-- Name: accounts_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joseantonioherrera
--

ALTER SEQUENCE public.accounts_user_id_seq OWNED BY public.accounts.user_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: joseantonioherrera
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO joseantonioherrera;

--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: joseantonioherrera
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_role_id_seq OWNER TO joseantonioherrera;

--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joseantonioherrera
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- Name: accounts user_id; Type: DEFAULT; Schema: public; Owner: joseantonioherrera
--

ALTER TABLE ONLY public.accounts ALTER COLUMN user_id SET DEFAULT nextval('public.accounts_user_id_seq'::regclass);


--
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: joseantonioherrera
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- Data for Name: account_roles; Type: TABLE DATA; Schema: public; Owner: joseantonioherrera
--

COPY public.account_roles (user_id, role_id, grant_date) FROM stdin;
1	1	2022-03-12 00:06:04.021135
2	2	2022-03-12 00:06:05.473997
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: joseantonioherrera
--

COPY public.accounts (user_id, firstname, password, email, created_on, last_login) FROM stdin;
1	James	pwd1	email3@gmail.com	2022-03-12 00:06:04.016086	\N
2	James	pwd2	email3@gmail.com	2022-03-12 00:06:04.018604	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: joseantonioherrera
--

COPY public.roles (role_id, role_name) FROM stdin;
1	lead
2	dev
\.


--
-- Name: accounts_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joseantonioherrera
--

SELECT pg_catalog.setval('public.accounts_user_id_seq', 1, false);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joseantonioherrera
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 1, false);


--
-- Name: account_roles account_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: joseantonioherrera
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT account_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: joseantonioherrera
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (user_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: joseantonioherrera
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: joseantonioherrera
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: account_roles account_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joseantonioherrera
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT account_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- Name: account_roles account_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joseantonioherrera
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT account_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.accounts(user_id);


--
-- PostgreSQL database dump complete
--

