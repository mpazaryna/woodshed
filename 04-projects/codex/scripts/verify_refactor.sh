#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default settings
DRY_RUN=false
BACKUP_DIR="refactor_backup_$(date +%Y%m%d_%H%M%S)"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --dry-run) DRY_RUN=true ;;
        -h|--help) 
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --dry-run    Show what would be done without making changes"
            echo "  -h, --help   Show this help message"
            exit 0
            ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Function to create backup
create_backup() {
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY RUN] Would create backup in: $BACKUP_DIR${NC}"
        return
    fi

    echo -e "${BLUE}Creating backup...${NC}"
    mkdir -p "$BACKUP_DIR/src"
    if cp src/*.ts "$BACKUP_DIR/src/" 2>/dev/null; then
        echo -e "${GREEN}✓ Backup created in: $BACKUP_DIR${NC}"
    else
        echo -e "${RED}✗ Failed to create backup${NC}"
        exit 1
    fi
}

echo -e "${BLUE}Starting refactor verification...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN MODE] No changes will be made${NC}"
fi

# 1. Create backup
create_backup

# 2. Verify new files exist
required_files=(
    "types.ts"
    "reader_medium.ts"
    "markdown.ts"
    "storage.ts"
    "article_service.ts"
    "main.ts"
    "main_test.ts"
)

echo -e "\nChecking required files..."
missing_files=0
for file in "${required_files[@]}"; do
    if [ -f "src/$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
    else
        echo -e "${RED}✗ $file is missing${NC}"
        missing_files=$((missing_files + 1))
    fi
done

# 3. Remove old file
if [ -f "src/article_reader.ts" ]; then
    if [ "$DRY_RUN" = true ]; then
        echo -e "\n${YELLOW}[DRY RUN] Would remove src/article_reader.ts${NC}"
    else
        echo -e "\nRemoving old article_reader.ts..."
        rm "src/article_reader.ts"
        echo -e "${GREEN}✓ article_reader.ts removed${NC}"
    fi
fi

# 4. Run tests
echo -e "\nChecking tests..."
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN] Would run: deno test --allow-net --allow-read --allow-write --allow-env src/main_test.ts${NC}"
else
    echo "Running tests..."
    if ! deno test --allow-net --allow-read --allow-write --allow-env src/main_test.ts; then
        echo -e "${RED}✗ Tests failed${NC}"
        echo -e "${BLUE}Backup available in: $BACKUP_DIR${NC}"
        exit 1
    fi
fi

# 5. Verify main functionality
echo -e "\nChecking main functionality..."
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN] Would run: deno run --allow-net --allow-read --allow-write --allow-env src/main.ts${NC}"
else
    if ! deno run --allow-net --allow-read --allow-write --allow-env src/main.ts; then
        echo -e "${RED}✗ Main program execution failed${NC}"
        echo -e "${BLUE}Backup available in: $BACKUP_DIR${NC}"
        exit 1
    fi
fi

# 6. Check for type errors
echo -e "\nChecking for type errors..."
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN] Would run: deno check src/*.ts${NC}"
else
    if ! deno check src/*.ts; then
        echo -e "${RED}✗ Type checking failed${NC}"
        echo -e "${BLUE}Backup available in: $BACKUP_DIR${NC}"
        exit 1
    fi
fi

# 7. Final status
if [ "$DRY_RUN" = true ]; then
    echo -e "\n${YELLOW}[DRY RUN] Verification completed. No changes were made.${NC}"
    echo -e "${YELLOW}The above shows what would happen in a real run.${NC}"
elif [ $missing_files -eq 0 ]; then
    echo -e "\n${GREEN}Refactor verification completed successfully!${NC}"
    echo -e "${BLUE}Backup available in: $BACKUP_DIR${NC}"
    echo -e "\nNew structure:"
    echo "src/"
    for file in "${required_files[@]}"; do
        echo "├── $file"
    done
else
    echo -e "\n${RED}Refactor verification failed: Missing required files${NC}"
    echo -e "${BLUE}Backup available in: $BACKUP_DIR${NC}"
    exit 1
fi