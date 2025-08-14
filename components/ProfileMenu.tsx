'use client';

import { AuthProps } from '@/types';
import { Avatar, Icon, Menu, Portal } from '@chakra-ui/react';
import { LuLayoutTemplate } from 'react-icons/lu';
import { MdLogout } from 'react-icons/md';

export const ProfileMenu = ({ displayName }: AuthProps) => {
  return (
    <Menu.Root variant={'solid'}>
      <Menu.Trigger rounded="full" focusRing="outside">
        <Avatar.Root size="sm">
          <Avatar.Fallback name={displayName} />
        </Avatar.Root>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item asChild value="/templates">
              <a href={'/templates'}>
                <Icon>
                  <LuLayoutTemplate fontSize="small" />
                </Icon>
                Templates
              </a>
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item asChild value="/logout">
              <a href={'/logout'} target="_blank" rel="noreferrer">
                <Icon>
                  <MdLogout fontSize="small" />
                </Icon>
                Logout
              </a>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
