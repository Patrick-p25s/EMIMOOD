const MESSAGE_TRANSLATIONS = {
  "Email already registered": "Cette adresse e-mail est déjà utilisée.",
  "Invalid email or password": "Adresse e-mail ou mot de passe incorrect.",
  "Incorrect email or password": "Adresse e-mail ou mot de passe incorrect.",
  "Invalid credentials": "Adresse e-mail ou mot de passe incorrect.",
};

function translate(message) {
  return MESSAGE_TRANSLATIONS[message] || message;
}

function inferFieldErrors(message) {
  const normalized = message.toLowerCase();
  if (normalized.includes("email")) return { email: translate(message) };
  if (normalized.includes("matricule"))
    return { matricule: translate(message) };
  if (normalized.includes("invitation") || normalized.includes("classe")) {
    return { codeInvitation: translate(message) };
  }
  return {};
}

export function getErrorDetails(error) {
  if (error.request && !error.response) {
    return {
      message:
        "Impossible de contacter le serveur. Vérifiez votre connexion puis réessayez.",
      fieldErrors: {},
    };
  }

  const data = error.response?.data;

  if (error.response?.status === 429) {
    return {
      message: "Trop de tentatives. Réessayez dans quelques instants.",
      fieldErrors: {},
    };
  }

  if (Array.isArray(data?.detail)) {
    const fieldErrors = data.detail.reduce((errors, detail) => {
      const field = detail.loc?.at(-1);
      if (typeof field === "string") errors[field] = translate(detail.msg);
      return errors;
    }, {});

    return {
      message: "Certains champs doivent être corrigés.",
      fieldErrors,
    };
  }

  if (typeof data?.detail === "string") {
    return {
      message: translate(data.detail),
      fieldErrors: inferFieldErrors(data.detail),
    };
  }

  return {
    message:
      "Une erreur inattendue est survenue. Réessayez dans quelques instants.",
    fieldErrors: {},
  };
}

export function getErrorMessage(error) {
  return getErrorDetails(error).message;
}
