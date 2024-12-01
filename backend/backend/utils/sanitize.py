import re
import unicodedata


def sanitize(string):
    sanitized_string = string.lower()
    sanitized_string = ' '.join(sanitized_string.split())

    return sanitized_string


def sanitize_username(name: str) -> str:
    # Remove initial and final spaces
    name = name.replace(' ', '')

    # normalize
    name_normalized = unicodedata.normalize('NFKD', name)
    name_no_accents = ''.join(
        c for c in name_normalized if not unicodedata.combining(c)
    )

    # Remove special characters (accept only letters)
    name_no_specials = re.sub(r'[^a-zA-Z]', '', name_no_accents)

    # convert to lower case
    name_corrected = name_no_specials.lower()

    return name_corrected


def sanitize_name(name: str) -> str:
    name = name.strip()
    name = re.sub(r'\s+', ' ', name)
    name_normalized = unicodedata.normalize('NFKD', name)
    name_no_accents = ''.join(
        c for c in name_normalized if not unicodedata.combining(c)
    )
    name_no_specials = re.sub(r'[^a-zA-Z\s]', ' ', name_no_accents)
    name_corrected = ''.join(
        name[i] if name_no_accents[i] in name_no_specials else ' '
        for i in range(len(name))
    )

    name_corrected = name_corrected.lower()
    name_corrected = re.sub(r'\s+', ' ', name_corrected)

    return name_corrected.strip()


def sanitize_email(email: str) -> str:
    # Normalize the email (lowercase and remove accents)
    email = email.lower()
    email_normalized = unicodedata.normalize('NFKD', email)
    email_no_accents = ''.join(
        c for c in email_normalized if not unicodedata.combining(c)
    )

    # Basic regex to validate the overall email format (before sanitizing)
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    # Validate email format
    if not re.match(email_pattern, email_no_accents):
        raise ValueError(f"Email '{email_no_accents}' is not valid.")

    # Check if the email contains an '@' before attempting to split
    if '@' not in email_no_accents:
        raise ValueError(f"Email '{email_no_accents}' should contain an '@'.")

    # Split the email into local and domain parts
    local_part, domain_part = email_no_accents.split('@', 1)

    # Clean the local part (allow only valid characters)
    local_part = re.sub(r'[^a-zA-Z0-9._%+-]', '', local_part)

    # Clean the domain part (allow only valid characters)
    domain_part = re.sub(r'[^a-zA-Z0-9.-]', '', domain_part)

    # Reassemble and return the sanitized email
    return f'{local_part}@{domain_part}'
