import ExcelJS from "exceljs";

import { SPREADSHEET_TEMPLATES } from "../constants";

export type SheetDefinition = {
  name: string;
  headers?: string[];
  rows?: (string | number | null)[][];
  formulas?: { cell: string; formula: string }[];
  columnWidths?: number[];
  freezeRow?: number;
  color?: string;
};

const PROJECT_MANAGER_SHEETS = [
  "Setup",
  "All-in-one Dashboard",
  "Monthly Calendar",
  "Weekly Calendar",
  "Project Overview",
  "Project Manager",
  "Project Budget",
  "Variable Tasks",
  "Recurring Tasks",
  "Task Schedule",
  "Task Filter",
  "Decision Matrix",
  "Kanban Board",
  "Gantt Chart",
  "Instructions",
];

const BUDGET_SHEETS = [
  "Easy Setup",
  "Bank Accounts",
  "Recurring Transactions",
  "Payments",
  "Variable Transactions",
  "All-in-one Dashboard",
  "Annual Totals",
  "Automated Calendar",
  "Paycheck Dashboard",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "50/30/20 Dashboard",
  "Expense Distribution",
  "Sinking Funds",
  "Debt Calculator",
  "Net Worth",
  "Investment Forecast",
  "No-Spending Challenge",
  "Instructions",
];

const WEEKLY_PLANNER_SHEETS = [
  "Setup",
  "Weekly Planner 1",
  "Weekly Planner 2",
  "Weekly Planner 3",
  "Weekly Planner 4",
  "Weekly Planner 5",
  "Weekly Planner 6",
  "Monthly Calendar",
  "Instructions",
];

export function getSheetNamesForTemplate(templateType: string): string[] {
  switch (templateType) {
    case "ultimate_project_manager":
      return PROJECT_MANAGER_SHEETS;
    case "ultimate_budget":
      return BUDGET_SHEETS;
    case "weekly_planner_pro":
      return WEEKLY_PLANNER_SHEETS;
    case "monthly_planner":
      return ["Setup", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Goals", "Instructions"];
    case "crm_tracker":
      return ["Dashboard", "Contacts", "Deals", "Pipeline", "Activities", "Reports", "Instructions"];
    case "expense_tracker":
      return ["Dashboard", "Categories", "Transactions", "Monthly Summary", "Annual Report", "Instructions"];
    default:
      return ["Setup", "Dashboard", "Data", "Reports", "Instructions"];
  }
}

export function buildSheetDefinitions(
  templateType: string,
  options: { sampleData?: boolean; colorTheme?: string; includeFormulas?: boolean }
): SheetDefinition[] {
  const sheetNames = getSheetNamesForTemplate(templateType);
  const theme = options.colorTheme ?? "#3B82F6";

  return sheetNames.map((name) => {
    if (name === "Instructions") {
      return {
        name,
        headers: ["Section", "Instructions"],
        rows: [
          ["Getting Started", "Fill in the Setup tab with your preferences."],
          ["Data Entry", "Enter your data in the respective tabs."],
          ["Formulas", "Protected formula cells calculate automatically."],
          ["Support", "Visit our help center for tutorials."],
        ],
        color: theme,
      };
    }

    if (name === "Setup") {
      return {
        name,
        headers: ["Setting", "Value"],
        rows: [
          ["Template", templateType.replace(/_/g, " ")],
          ["Created", new Date().toLocaleDateString()],
          ["Currency", "USD"],
          ["Fiscal Year Start", "January"],
        ],
        color: theme,
      };
    }

    if (name.includes("Dashboard")) {
      return {
        name,
        headers: ["Metric", "Current", "Target", "Status"],
        rows: options.sampleData
          ? [
              ["Revenue", 125000, 150000, "On Track"],
              ["Expenses", 45000, 50000, "Under Budget"],
              ["Profit Margin", "64%", "60%", "Above Target"],
              ["Active Projects", 12, 15, "Growing"],
            ]
          : [["", "", "", ""]],
        formulas: options.includeFormulas
          ? [{ cell: "B5", formula: "B2-B3" }]
          : undefined,
        color: theme,
        freezeRow: 1,
      };
    }

    if (name.includes("Weekly Planner")) {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return {
        name,
        headers: ["Time", ...days],
        rows: options.sampleData
          ? [
              ["6:00 AM", "Morning routine", "", "Gym", "", "Review goals", "", ""],
              ["9:00 AM", "Deep work", "Meetings", "Deep work", "Planning", "", "", ""],
              ["12:00 PM", "Lunch", "Lunch", "Lunch", "Lunch", "", "", ""],
              ["2:00 PM", "Projects", "Calls", "Projects", "Admin", "", "", ""],
              ["5:00 PM", "Wrap up", "Wrap up", "Wrap up", "Wrap up", "", "", ""],
            ]
          : Array.from({ length: 5 }, () => ["", ...days.map(() => "")]),
        color: theme,
        freezeRow: 1,
      };
    }

    if (["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].includes(name)) {
      return {
        name,
        headers: ["Date", "Category", "Description", "Amount", "Type"],
        rows: options.sampleData
          ? [
              ["1", "Income", "Salary", 5000, "Credit"],
              ["5", "Housing", "Rent", -1500, "Debit"],
              ["10", "Food", "Groceries", -350, "Debit"],
              ["15", "Transport", "Gas", -80, "Debit"],
            ]
          : [["", "", "", "", ""]],
        formulas: options.includeFormulas
          ? [{ cell: "E10", formula: `SUMIF(E2:E9,"Credit",D2:D9)` }]
          : undefined,
        color: theme,
        freezeRow: 1,
      };
    }

    return {
      name,
      headers: ["ID", "Name", "Status", "Priority", "Due Date", "Notes"],
      rows: options.sampleData
        ? [
            [1, "Sample Item 1", "In Progress", "High", "2026-07-01", ""],
            [2, "Sample Item 2", "Pending", "Medium", "2026-07-15", ""],
            [3, "Sample Item 3", "Complete", "Low", "2026-06-20", ""],
          ]
        : [["", "", "", "", "", ""]],
      color: theme,
      freezeRow: 1,
    };
  });
}

export async function buildWorkbookBuffer(
  templateType: string,
  options: { sampleData?: boolean; colorTheme?: string; includeFormulas?: boolean }
): Promise<Buffer> {
  const sheets = buildSheetDefinitions(templateType, options);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "VireoMorph Digital Product Studio";
  workbook.created = new Date();

  for (const sheetDef of sheets) {
    const sheet = workbook.addWorksheet(sheetDef.name);

    if (sheetDef.headers) {
      const headerRow = sheet.addRow(sheetDef.headers);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: hexToArgb(sheetDef.color ?? "#3B82F6") },
      };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };
    }

    if (sheetDef.rows) {
      for (const row of sheetDef.rows) {
        sheet.addRow(row);
      }
    }

    if (sheetDef.formulas) {
      for (const f of sheetDef.formulas) {
        sheet.getCell(f.cell).value = { formula: f.formula };
        sheet.getCell(f.cell).protection = { locked: true };
      }
    }

    if (sheetDef.columnWidths) {
      sheetDef.columnWidths.forEach((w, i) => {
        sheet.getColumn(i + 1).width = w;
      });
    } else {
      sheet.columns.forEach((col) => {
        col.width = 18;
      });
    }

    if (sheetDef.freezeRow) {
      sheet.views = [{ state: "frozen", ySplit: sheetDef.freezeRow }];
    }

    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheetDef.headers?.length ?? 6 },
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

function hexToArgb(hex: string): string {
  const clean = hex.replace("#", "");
  return `FF${clean.toUpperCase()}`;
}

export function isValidSpreadsheetTemplate(type: string): boolean {
  return (SPREADSHEET_TEMPLATES as readonly string[]).includes(type);
}
