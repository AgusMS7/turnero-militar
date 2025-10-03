import SidebarButton from './SidebarButton'
import SidebarLogoutButton from './SidebarLogoutButton'

export default function Sidebar() {
    return (
        <div className='w-full md:w-65 mb-4 md:mb-0'>
            <div>
                <img className='w-56 mx-auto md:mx-0' src="/full-salud-logo.png" />
            </div>
            <div className='flex flex-col mt-4 gap-0.5'>
                <SidebarButton 
                    text='Médicos'
                    link='/administrator'
                    primaryIconPath='/stethoscope-black.svg'
                    secondaryIconPath='/stethoscope-white.svg'
                />
                <SidebarButton
                    text='Secretarias'
                    link='/administrator/secretarias'
                    primaryIconPath='/user-black.svg'
                    secondaryIconPath='/user-white.svg'
                />
                <SidebarButton
                    text='Obras Sociales'
                    link='/administrator/obrasSociales'
                    primaryIconPath='/medica-case-black.svg'
                    secondaryIconPath='/medica-case-white.svg'
                />
                <SidebarButton
                    text='Estadisticas'
                    link='/administrator/estadisticas'
                    primaryIconPath='/estadisticas.svg'
                    secondaryIconPath='/estadisticas-white.svg'
                />
                <SidebarLogoutButton />
            </div>
        </div>
    )
}
