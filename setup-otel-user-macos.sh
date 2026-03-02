#!/bin/bash
# =============================================================================
# Claude Code OTEL Setup Script - macOS (Managed Settings)
# =============================================================================
# Run this script ONCE per machine with sudo.
# It creates /Library/Application Support/ClaudeCode/managed-settings.json
# This is the system-wide managed settings path with highest precedence.
# =============================================================================

set -e

# Default AWS profile to try
DEFAULT_PROFILE="gamekit-next-aq-prod-aws-bedrock-136172187201"

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: This script must be run with sudo"
    echo "Usage: sudo $0"
    exit 1
fi

# Get the actual user (not root)
if [ -n "$SUDO_USER" ]; then
    ACTUAL_USER="$SUDO_USER"
else
    ACTUAL_USER="$USER"
fi

# Function to get AWS SSO username from ARN
get_aws_sso_username() {
    local profile="$1"
    local profile_arg=""
    
    if [ -n "$profile" ]; then
        profile_arg="--profile $profile"
    fi
    
    # Run as the actual user (not root) to get their AWS credentials
    local arn=$(sudo -u "$ACTUAL_USER" aws sts get-caller-identity --query "Arn" --output text $profile_arg 2>/dev/null)
    
    if [ -n "$arn" ] && [ "$arn" != "None" ]; then
        # Extract username from ARN (last part after /)
        local username=$(echo "$arn" | sed -n 's|.*/\([^/]*\)$|\1|p')
        
        # Remove @domain.com if present
        username=$(echo "$username" | sed 's/@.*//')
        
        if [ -n "$username" ]; then
            echo "$username"
            return 0
        fi
    fi
    return 1
}

echo "=== Claude Code OTEL Setup (macOS) ==="
echo ""

# Try AWS SSO with default profile first
echo "Attempting to get username from AWS SSO (profile: $DEFAULT_PROFILE)..."
AWS_USERNAME=$(get_aws_sso_username "$DEFAULT_PROFILE")

if [ -z "$AWS_USERNAME" ]; then
    echo "Could not get username from default profile."
    echo ""
    read -p "Enter your AWS profile name (or press Enter to use local username): " CUSTOM_PROFILE
    
    if [ -n "$CUSTOM_PROFILE" ]; then
        echo "Trying profile: $CUSTOM_PROFILE..."
        AWS_USERNAME=$(get_aws_sso_username "$CUSTOM_PROFILE")
    fi
fi

if [ -n "$AWS_USERNAME" ]; then
    USERNAME="$AWS_USERNAME"
    echo "Found AWS SSO username: $USERNAME"
else
    echo "Could not get AWS SSO username, using local macOS username"
    USERNAME="$ACTUAL_USER"
    echo "Using local username: $USERNAME"
fi

# Sanitize username for OTEL (allow dots and underscores)
SANITIZED_USERNAME=$(echo "$USERNAME" | sed 's/[^a-zA-Z0-9._-]/_/g')

echo ""
echo "Username: $USERNAME"
echo "Sanitized for OTEL: $SANITIZED_USERNAME"
echo ""

# Official managed settings path for macOS
MANAGED_SETTINGS_DIR="/Library/Application Support/ClaudeCode"
MANAGED_SETTINGS_PATH="$MANAGED_SETTINGS_DIR/managed-settings.json"

echo "Target path: $MANAGED_SETTINGS_PATH"
echo ""

# Create directory if needed
if [ ! -d "$MANAGED_SETTINGS_DIR" ]; then
    mkdir -p "$MANAGED_SETTINGS_DIR"
    echo "Created directory: $MANAGED_SETTINGS_DIR"
fi

# OTEL configuration
OTEL_ENDPOINT="http://internal-otel-collector-alb-1149882247.us-east-1.elb.amazonaws.com:4318"

# Check if settings already exist and merge if so
if [ -f "$MANAGED_SETTINGS_PATH" ]; then
    echo "Existing managed-settings.json found. Merging..."

    # Use jq if available for proper JSON merging
    if command -v jq &> /dev/null; then
        EXISTING=$(cat "$MANAGED_SETTINGS_PATH")

        # Merge env settings
        echo "$EXISTING" | jq --arg user "$SANITIZED_USERNAME" --arg endpoint "$OTEL_ENDPOINT" '
            .env = (.env // {}) + {
                "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
                "OTEL_METRICS_EXPORTER": "otlp",
                "OTEL_LOGS_EXPORTER": "otlp",
                "OTEL_EXPORTER_OTLP_PROTOCOL": "http/protobuf",
                "OTEL_EXPORTER_OTLP_ENDPOINT": $endpoint,
                "OTEL_RESOURCE_ATTRIBUTES": ("user.name=" + $user)
            }
        ' > "$MANAGED_SETTINGS_PATH"
    else
        echo "Warning: jq not found. Creating new settings file (existing settings will be preserved in .backup)"
        cp "$MANAGED_SETTINGS_PATH" "$MANAGED_SETTINGS_PATH.backup"

        cat > "$MANAGED_SETTINGS_PATH" << EOF
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "http/protobuf",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "$OTEL_ENDPOINT",
    "OTEL_RESOURCE_ATTRIBUTES": "user.name=$SANITIZED_USERNAME"
  }
}
EOF
    fi
else
    # Create new settings file
    cat > "$MANAGED_SETTINGS_PATH" << EOF
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "http/protobuf",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "$OTEL_ENDPOINT",
    "OTEL_RESOURCE_ATTRIBUTES": "user.name=$SANITIZED_USERNAME"
  }
}
EOF
fi

# Set appropriate permissions
chmod 644 "$MANAGED_SETTINGS_PATH"
chown root:wheel "$MANAGED_SETTINGS_PATH"

echo "Settings written to: $MANAGED_SETTINGS_PATH"
echo ""
echo "=== Setup Complete ==="
echo ""
echo "Your username '$SANITIZED_USERNAME' will now appear in OTEL metrics."
echo "Restart Claude Code for the changes to take effect."
echo ""
echo "To verify, run Claude Code and check CloudWatch for metrics with:"
echo "  user.name = $SANITIZED_USERNAME"
echo ""
echo "Note: This is system-wide managed settings (highest precedence)."
echo "All users on this machine will use these OTEL settings."
