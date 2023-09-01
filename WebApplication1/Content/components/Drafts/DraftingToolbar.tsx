import './css/toolbar.css';
import React, { useState } from 'react';
import Flex from 'react-flexview';
import { Modal } from 'react-bootstrap';
import ActionMenu from './ActionMenu';

import { IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FileUploader from "../Upload/FileUploader";

export interface DraftingToolbarProps {
  handleToggleAutofill: () => void;
  handleSaveDraft: (event: any) => void;
  handleExport: () => void;
  handleImportSuccess:  (puzzle: any, filename?: string) => void;
  handleImportFail: () => void;
  handleUpdateColumns: (event: any) => void;
  handleUpdateRows: (event: any) => void;
  handleUpdateTitle: (title: string) => void;
  handlePublish: () => void;
  isMobile: boolean;
    rows: number;
    columns: number;
    title: string;
}

interface DraftingToolbarState {
  isExpanded: boolean;
  isShowingImportModal: boolean;
  isShowingChangeDimensionsModal: boolean;
  isShowingChangeTitleModal: boolean;
    rows: number;
    columns: number;
    title: string;
}

export const DraftingToolbar = (
    { handleToggleAutofill,
        handleSaveDraft,
        handleExport,
        handleImportSuccess, 
        handleImportFail,
        handlePublish,
        handleUpdateRows, 
        handleUpdateColumns, 
        handleUpdateTitle,
        isMobile,
        rows,
        columns,
        title
    }: DraftingToolbarProps) => {
  const [state, setState] = useState<DraftingToolbarState>({
    isExpanded: false,
    isShowingImportModal: false,
    isShowingChangeDimensionsModal: false,
    isShowingChangeTitleModal: false,
      rows: rows,
      columns: columns,
      title: title
  });
  
  const handleExpandClick = () => {
    setState((prevState: DraftingToolbarState) => ({
        ...prevState, isExpanded: !prevState.isExpanded
    }));
  };
  
  const handleToggleImport = () => {
    setState((prevState: DraftingToolbarState) => ({
        ...prevState, isShowingImportModal: !prevState.isShowingImportModal
        }));
    };
  
  const handleToggleChangeDimensions = () => {
    setState((prevState: DraftingToolbarState) => ({
        ...prevState, isShowingChangeDimensionsModal: !prevState.isShowingChangeDimensionsModal
        }));
    }
    
    const handleToggleChangeTitle = () => {
        setState((prevState: DraftingToolbarState) => ({
            ...prevState, isShowingChangeTitleModal: !prevState.isShowingChangeTitleModal
        }));
    };
    
    const handleUpdateRowsInternal = (event) => {
        setState((prevState: DraftingToolbarState) => ({
            ...prevState, rows: event.target.value
        }));
        handleUpdateRows(event.target.value);
    };

    const handleUpdateColumnsInternal = (event) => {
        setState((prevState: DraftingToolbarState) => ({
            ...prevState, columns: event.target.value
        }));
        handleUpdateColumns(event.target.value);
    };
    
    const handleUpdateTitleInternal = (event) => {
        setState((prevState: DraftingToolbarState) => ({
            ...prevState, title: event.target.value
        }));
        handleUpdateTitle(event.target.value);
    };
  
  const renderFileMenu = () => {
    return (
        <ActionMenu
            label="File"
            onBlur={() => {}}
            actions={{
              'Save': handleSaveDraft,
              //'Save As': onToggleColorAttributionMode,
              'Import .PUZ file': handleToggleImport,
              'Export as .PUZ file': handleExport, 
                'Publish to CrossWorld!': handlePublish,
            }}
        />
    );
  }

  const renderEditMenu = () => {
        return (
            <ActionMenu
                label="Edit"
                onBlur={() => {}}
                actions={{
                    'Change Dimensions': handleToggleChangeDimensions,
                    // 'Publish Anonymously': handleChangeAnonymity,
                    'Change Title': handleToggleChangeTitle,
                }}
            />
        );
    };
  
  const renderToolsMenu = () => {
    return (
        <ActionMenu
            label="Tools"
            onBlur={() => {}}
            actions={{
                'Run Autofill': handleToggleAutofill
            }}
        />
    );
    };
  
  const renderToolbar = () => {
      const { isExpanded, isShowingImportModal, isShowingChangeDimensionsModal } = state;
      return (
          <div>
              {isMobile ?
                  <div>
                      { isExpanded ?
                          <Flex className="toolbar--mobile" vAlignContent="center">
                              <Flex className="toolbar--mobile--top" grow={1} vAlignContent="center">
                                  {renderFileMenu()}
                                  <IconButton className="expand-button" onClick={handleExpandClick}>
                                      <ExpandLessIcon />
                                  </IconButton>
                              </Flex>
                          </Flex> :
                          <div className="expand-button-div">
                              <IconButton className="expand-button" onClick={handleExpandClick}>
                                  <ExpandMoreIcon />
                              </IconButton>
                          </div>
                      }
                  </div> :
                  <div className="toolbar">
                      <Flex>
                          {renderFileMenu()}
                          {renderEditMenu()}
                          {renderToolsMenu()}
                      </Flex>
                      <Modal show={isShowingImportModal} onHide={handleToggleImport} centered>
                          <Modal.Body style={{maxWidth: '25vw', margin: '0 auto'}}>
                              <FileUploader success={handleImportSuccess} fail={handleImportFail} v2 />
                          </Modal.Body>
                      </Modal>
                      <Modal show={isShowingChangeDimensionsModal} onHide={handleToggleChangeDimensions} centered>
                          <Modal.Body style={{maxWidth: '25vw', margin: '0 auto'}}>
                              <Flex>
                                  <div>Rows: </div>
                                  &nbsp;
                                  <input
                                      type="number"
                                      defaultValue={rows}
                                        onChange={handleUpdateRowsInternal}
                                  />
                              </Flex>
                              &nbsp;
                              <Flex>
                                  <div>Columns: </div>
                                  &nbsp;
                                  <input
                                      type="number"
                                      defaultValue={columns}
                                      onChange={handleUpdateColumnsInternal}
                                  />
                              </Flex>
                          </Modal.Body>
                      </Modal>
                        <Modal show={state.isShowingChangeTitleModal} onHide={handleToggleChangeTitle} centered>
                            <Modal.Body style={{maxWidth: '25vw', margin: '0 auto'}}>
                                <Flex>
                                    <div>Title: </div>
                                    &nbsp;
                                    <input
                                        type="text"
                                        defaultValue={title}
                                        onChange={handleUpdateTitleInternal}
                                    />
                                </Flex>
                            </Modal.Body>
                        </Modal>
                  </div>
              }
          </div>
      )
  }
  
  return renderToolbar();
}
