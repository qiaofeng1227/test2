/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* eslint-disable no-param-reassign */
import { styled, t } from '@superset-ui/core';
import React, { FC } from 'react';
import Icon from 'src/components/Icon';
import Button from 'src/components/Button';
import { useSelector } from 'react-redux';
import { getInitialMask } from 'src/dataMask/reducer';
import { DataMaskUnit, DataMaskUnitWithId } from 'src/dataMask/types';
import FilterConfigurationLink from './FilterConfigurationLink';
import { useFilters } from './state';
import { Filter } from '../types';

const TitleArea = styled.h4`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;
  padding: ${({ theme }) => theme.gridUnit * 2}px;

  & > span {
    flex-grow: 1;
  }
`;

const ActionButtons = styled.div`
  display: grid;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  ${({ theme }) =>
    `padding: 0 ${theme.gridUnit * 2}px ${theme.gridUnit * 2}px`};

  .btn {
    flex: 1;
  }
`;

type HeaderProps = {
  toggleFiltersBar: (arg0: boolean) => void;
  onApply: () => void;
  setDataMaskSelected: (arg0: (draft: DataMaskUnit) => void) => void;
  dataMaskSelected: DataMaskUnit;
  dataMaskApplied: DataMaskUnitWithId;
  isApplyDisabled: boolean;
};

const Header: FC<HeaderProps> = ({
  onApply,
  isApplyDisabled,
  dataMaskSelected,
  dataMaskApplied,
  setDataMaskSelected,
  toggleFiltersBar,
}) => {
  const filters = useFilters();
  const filterValues = Object.values<Filter>(filters);
  const canEdit = useSelector<any, boolean>(
    ({ dashboardInfo }) => dashboardInfo.dash_edit_perm,
  );

  const handleClearAll = () => {
    filterValues.forEach(filter => {
      setDataMaskSelected(draft => {
        draft[filter.id] = getInitialMask(filter.id);
      });
    });
  };

  const isClearAllDisabled = Object.values(dataMaskApplied).every(
    filter =>
      dataMaskSelected[filter.id]?.currentState?.value === null ||
      (!dataMaskSelected[filter.id] && filter.currentState?.value === null),
  );

  return (
    <>
      <TitleArea>
        <span>{t('Filters')}</span>
        {canEdit && (
          <FilterConfigurationLink createNewOnOpen={filterValues.length === 0}>
            <Icon name="edit" data-test="create-filter" />
          </FilterConfigurationLink>
        )}
        <Icon name="expand" onClick={() => toggleFiltersBar(false)} />
      </TitleArea>
      <ActionButtons>
        <Button
          disabled={isClearAllDisabled}
          buttonStyle="tertiary"
          buttonSize="small"
          onClick={handleClearAll}
          data-test="filter-reset-button"
        >
          {t('Clear all')}
        </Button>
        <Button
          disabled={isApplyDisabled}
          buttonStyle="primary"
          htmlType="submit"
          buttonSize="small"
          onClick={onApply}
          data-test="filter-apply-button"
        >
          {t('Apply')}
        </Button>
      </ActionButtons>
    </>
  );
};

export default Header;
