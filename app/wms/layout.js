'use client';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Save from '@_components/wmsLayout/Save';
import Library from '@_components/wmsLayout/Library';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;

const WmsLayout = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<Layout style={{height: '100vh', width: '100vw'}}>
			<Sider 
				trigger={null} 
				collapsible 
				collapsed={collapsed} 
				collapsedWidth={0}
				width={300}
			>
				<Library />
			</Sider>
			<Layout>
				<Header 
					style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: 0,
					}}
				>
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							color: 'white',
							fontSize: '16px',
							width: 64,
							height: 64,
						}}
					/>
					<img src='/logo.png' alt="Logo" style={{ height: '75%' }} />
					<Save />
				</Header>
				<Content
					style={{
					margin: '0px',
					padding: '0px',
					minHeight: 280,
					}}
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
};

export default WmsLayout;