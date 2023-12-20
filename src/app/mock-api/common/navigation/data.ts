/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';


export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/dashboard/managment',
    },{
        id      : 'dashboards',
        title   : 'Iva e Gestione',
        type    : 'group',
        icon    : 'heroicons_outline:currency-euro',
        children: [
            {
                id   : 'dashboards.project',
                title: 'Project',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-document-check',
                link : '/dashboards/project',
            },
        ],
    },{
        id   : 'pages.settings',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog-8-tooth',
        link : '/dashboard/settings',
    },
];
