import {Ionicons} from '@expo/vector-icons';
export type TabRouteName = keyof typeof icon;
export  const icon= {
        profile:(props: any) => <Ionicons name='person-circle' size={28} color={'#222'} {...props} />,
        reward:(props: any) => <Ionicons name='gift' size={28} color={'#222'} {...props} />,
        index:(props: any) => <Ionicons name='play-circle' size={28} color={'#222'} {...props} />,
        progress:(props: any) => <Ionicons name='bar-chart' size={28} color={'#222'} {...props} />,
        setting:(props: any) => <Ionicons name='settings' size={28} color={'#222'} {...props} />,
    }