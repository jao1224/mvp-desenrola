import {
    Rocket,
    LayoutDashboard,
    Users,
    Filter,
    Calendar,
    FileText,
    ClipboardList,
    Folder,
    DollarSign,
    Settings,
    Edit2,
    Trash2,
    PartyPopper,
    AlertTriangle,
    Megaphone,
    Handshake,
    Briefcase,
    File,
    ArrowDownCircle,
    ArrowUpCircle,
    FolderOpen,
    CheckCircle,
    XCircle,
    LogOut,
    Menu,
    Plus
} from 'lucide';

// Store for initialized icons to avoid re-creating them unnecessarily
// though createIcons is efficient.

/**
 * Returns an SVG string for the given icon name.
 * Since we are using Vanilla JS string templates, we need the SVG string.
 * Lucide's `createIcons` works on DOM elements with `data-lucide`.
 * But to insert into template literals, we might want the SVG directly?
 * 
 * Actually, the standard Lucide Vanilla usage is `createIcons({ icons })` which replaces key elements.
 * BUT, our render functions return HTML strings that update `innerHTML`.
 * 
 * Strategy:
 * 1. Insert elements like `<i data-lucide="icon-name"></i>` in our HTML strings.
 * 2. Call `lucide.createIcons()` AFTER updating the DOM.
 * 
 * However, `createIcons` needs to be called every time we render.
 * 
 * Alternative: get the SVG string directly. Lucide exports individual icons as objects with `toSvg()`.
 * Let's use that approach for cleaner template integration without needing a post-render effect hook everywhere.
 */

const icons: Record<string, any> = {
    rocket: Rocket,
    dashboard: LayoutDashboard,
    users: Users,
    filter: Filter,
    calendar: Calendar,
    'file-text': FileText,
    clipboard: ClipboardList,
    folder: Folder,
    dollar: DollarSign,
    settings: Settings,
    edit: Edit2,
    trash: Trash2,
    party: PartyPopper,
    alert: AlertTriangle,
    megaphone: Megaphone,
    handshake: Handshake,
    briefcase: Briefcase,
    file: File,
    'arrow-down': ArrowDownCircle,
    'arrow-up': ArrowUpCircle,
    'folder-open': FolderOpen,
    check: CheckCircle,
    x: XCircle,
    logout: LogOut,
    menu: Menu,
    plus: Plus
};

export function getIcon(name: string, classes: string = ''): string {
    const iconData = icons[name];
    if (!iconData) {
        console.warn(`Icon '${name}' not found.`);
        return '';
    }

    // Default Lucide attributes
    const defaultAttrs = {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        class: `lucide lucide-${name} ${classes}`.trim()
    };

    // Construct attributes string
    const attrsStr = Object.entries(defaultAttrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');

    // Construct children
    // iconData is Array<[tag, attrs]>
    // e.g. [ ['path', { d: '...' }], ... ]
    let childrenStr = '';

    if (Array.isArray(iconData)) {
        childrenStr = iconData.map(([tag, attrs]: [string, Record<string, string>]) => {
            const childAttrs = Object.entries(attrs)
                .map(([k, v]) => `${k}="${v}"`)
                .join(' ');
            return `<${tag} ${childAttrs}></${tag}>`;
        }).join('');
    }

    return `<svg ${attrsStr}>${childrenStr}</svg>`;
}

// Global style for icons to ensure alignment
const style = document.createElement('style');
style.textContent = `
    .icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        stroke-width: 2px;
    }
    .icon-sm {
        width: 16px;
        height: 16px;
    }
    .icon-lg {
        width: 24px;
        height: 24px;
    }
`;
document.head.appendChild(style);
